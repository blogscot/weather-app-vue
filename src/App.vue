<template>
  <div id="app">
    <div v-if="tempsLoaded">
      <button @click="toggleDisplay()">{{ displayMode }}</button>
      <button @click="toggleTempScale()">°{{ scale }}</button>
      <Weather
        :displayMode="displayMode"
        :temps="temps"
        :main="weather.main"
        :dt="weather.dt"
        :sys="weather.sys"
        :scale="scale"
      ></Weather>
    </div>
    <p v-if="state == 'SeekingPermission'">Welcome to the Weather App</p>
    <p v-if="state == 'GeolocationNotSupported'">
      Geo-loacation not supported by browser
    </p>
    <p v-if="state == 'PermissionRejected'">
      Geo-loacation permission rejected by user
    </p>
    <p v-if="state == 'FetchDataFailed'">
      Failed to fetch weather data. Oh noes!
    </p>
    <p v-if="state == 'LoadingData'">Loading weather data</p>
    <p v-if="state == 'FetchImagesFailed'">
      Failed to fetch weather images. Oh noes!
    </p>
  </div>
</template>

<script>
import Weather from "./components/Weather";
import { toFahrenheit, toCelcius, fromKelvin, delay } from "./utils";

const updateInterval = 20 * 60 * 1000;

// const devServer = null;
const devServer = "http://localhost:3000";

const states = [
  "SeekingPermission",
  "GeolocationNotSupported",
  "PermissionRejected",
  "LoadingData",
  "FetchDataFailed",
  "LoadedTemps",
  "LoadedImages",
  "FetchImagesFailed"
];
const SeekingPermission = 0;
const GeolocationNotSupported = 1;
const PermissionRejected = 2;
const LoadingData = 3;
const FetchDataFailed = 4;
const LoadedTemps = 5;
const LoadedImages = 6;
const FetchImagesFailed = 7;

const openWeatherMapPrefix = "https://api.openweathermap.org/data/2.5/weather?";
const unsplashAPIPrefix = "https://api.unsplash.com/search/photos?client_id=";

export default {
  name: "App",
  components: {
    Weather
  },
  async created() {
    await delay(1000); // Delay for welcome message
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherData,
        () => (this.state = states[PermissionRejected])
      );

      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          this.getWeatherData,
          () => (this.state = states[PermissionRejected])
        );
      }, updateInterval);
    } else {
      this.state = states[GeolocationNotSupported];
    }
  },
  computed: {
    tempsLoaded() {
      return (
        this.state == "LoadedTemps" ||
        this.state == "LoadedImages" ||
        this.state == "FetchImagesFailed"
      );
    }
  },
  methods: {
    async getWeatherData(position) {
      this.state = states[LoadingData];

      const {
        coords: { latitude, longitude }
      } = position;
      this.weatherAPIURL = `${openWeatherMapPrefix}lat=${latitude}&lon=${longitude}&APPID=${
        process.env.VUE_APP_WEATHER_API_KEY
      }`;

      try {
        this.weather = await this.fetchWeatherData();
        this.storeTemperatures(this.weather.main);
        this.state = states[LoadedTemps];
      } catch (e) {
        this.state = states[FetchDataFailed];
      }

      try {
        const conditions = this.weather.weather[0].main;
        const images = await this.fetchWeatherImages(conditions);

        const imageData = images.map(image => {
          const {
            alt_description,
            urls: { raw },
            user: { name },
            links: { html }
          } = image;
          return { alt_description, raw, name, html };
        });
        console.log(imageData);

        // TODO:
        // 1. get the window size
        // 2. build url for new unsplash image (use first one)
        // 3. update the page's background image

        this.state = states[LoadedImages];
      } catch (e) {
        this.state = states[FetchImagesFailed];
      }
    },
    async fetchWeatherData() {
      return await fetch(`${devServer}/weather` || this.weatherAPIURL).then(
        response => response.json()
      );
    },
    async fetchWeatherImages(conditions) {
      const clientID = process.env.VUE_APP_UNSPLASH_CLIENT_ID;
      const unsplashAPIURL = `${unsplashAPIPrefix}${clientID}&query=${conditions}`;
      const response = await fetch(
        `${devServer}/unsplash` || unsplashAPIURL
      ).then(response => response.json());
      return response.results;
    },
    toggleDisplay() {
      switch (this.displayMode) {
        case "temp":
          this.displayMode = "minmax";
          break;
        case "minmax":
          this.displayMode = "full";
          break;
        case "full":
          this.displayMode = "temp";
          break;
      }
    },
    storeTemperatures(main) {
      const { temp, temp_min, temp_max } = main;
      this.temps = {
        current: fromKelvin(temp),
        min: fromKelvin(temp_min),
        max: fromKelvin(temp_max)
      };
      if (this.scale === "F") {
        this.temps = {
          current: toFahrenheit(this.temps.current),
          min: toFahrenheit(this.temps.min),
          max: toFahrenheit(this.temps.max)
        };
      }
    },
    toggleTempScale() {
      if (this.scale === "C") {
        this.scale = "F";
        this.temps = {
          current: toFahrenheit(this.temps.current),
          min: toFahrenheit(this.temps.min),
          max: toFahrenheit(this.temps.max)
        };
      } else {
        this.scale = "C";
        this.temps = {
          current: toCelcius(this.temps.current),
          min: toCelcius(this.temps.min),
          max: toCelcius(this.temps.max)
        };
      }
    }
  },
  data() {
    return {
      temps: {},
      displayMode: "temp",
      scale: "C",
      state: states[SeekingPermission],
      weather: {},
      weatherAPIURL: ""
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
  border-radius: 4px;
  font-size: 18px;
  padding: 8px 18px;
  margin-bottom: 1rem;
  box-shadow: 2px 2px 4px 0px black;
  outline: none;
  opacity: 0.3;
}
button:hover {
  opacity: 1;
  cursor: pointer;
}
button:active {
  box-shadow: 2px 2px 4px 0px #444;
}
html {
  background-size: cover;
  background: url("https://www.eiseverywhere.com/file_uploads/a0488db4ce271e7ba5b8c4c4fff8ba4a_AventriBackgroundBW.jpg")
    no-repeat center center fixed;
}
</style>
