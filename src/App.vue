<template>
  <div id="app">
    <div v-if="tempsLoaded">
      <button @click="toggleDisplay()">{{ displayMode }}</button>
      <button @click="toggleTempScale()">°{{ scale }}</button>
      <Weather
        :status="weather.weather[0].main"
        :displayMode="displayMode"
        :temps="temps"
        :main="weather.main"
        :dt="weather.dt"
        :sys="weather.sys"
        :scale="scale"
      >
        <div v-if="state == 'LoadedImages'">
          <Attribute
            :photographer="photographer.name"
            :link="photographer.html"
          ></Attribute>
        </div>
      </Weather>
    </div>
    <AlertBox v-if="state == 'SeekingPermission'">
      <p>Welcome to the Weather App</p>
    </AlertBox>
    <AlertBox v-if="state == 'GeolocationNotSupported'">
      <p>Geo-loacation not supported by browser</p>
    </AlertBox>
    <AlertBox class="error" v-if="state == 'PermissionRejected'">
      <p>Geo-loacation permission rejected by user</p>
    </AlertBox>
    <AlertBox class="error" v-if="state == 'FetchDataFailed'">
      <p>Failed to fetch weather data. Oh noes!</p>
    </AlertBox>
    <AlertBox class="info" v-if="state == 'LoadingData'">
      <p>Loading weather data</p>
    </AlertBox>
    <AlertBox class="error" v-if="state == 'FetchImagesFailed'">
      <p>Failed to fetch weather images. Oh noes!</p>
    </AlertBox>
  </div>
</template>

<script>
import Weather from "./components/Weather";
import AlertBox from "./components/AlertBox";
import Attribute from "./components/Attribute";
import {
  toFahrenheit,
  toCelcius,
  fromKelvin,
  delay,
  getDimensions
} from "./utils";

const updateInterval = 20 * 60 * 1000;

const devServer = process.env.VUE_APP_DEV_SERVER;

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
const unsplashAPIPrefix = "https://api.unsplash.com/photos/random?client_id=";

export default {
  name: "App",
  components: {
    AlertBox,
    Attribute,
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
        return;
      }

      try {
        const conditions = this.weather.weather[0].main;
        const image = await this.fetchWeatherImage(conditions);
        const {
          urls: { raw },
          user: { name },
          links: { html }
        } = image;

        this.photographer = { name, html };
        this.updateBackground(raw);
        this.state = states[LoadedImages];
      } catch (e) {
        this.state = states[FetchImagesFailed];
      }
    },
    updateBackground(raw) {
      const { width, height } = getDimensions();
      const options = `&q=80&fm=jpg&crop=entropy&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
      const unsplashImageURL = `${raw}${options}`;
      const html = document.querySelector("html");
      html.style.backgroundImage = `url(${unsplashImageURL})`;
    },
    async fetchWeatherData() {
      return await fetch(
        devServer ? `${devServer}/weather` : this.weatherAPIURL
      ).then(response => response.json());
    },
    async fetchWeatherImage(conditions) {
      const clientID = process.env.VUE_APP_UNSPLASH_CLIENT_ID;
      const unsplashAPIURL = `${unsplashAPIPrefix}${clientID}&query=${conditions}`;
      const response = await fetch(
        devServer ? `${devServer}/unsplash` : unsplashAPIURL
      ).then(response => response.json());
      return response;
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
      displayMode: "temp",
      photographer: {},
      scale: "C",
      state: states[SeekingPermission],
      temps: {},
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
  font-size: 16px;
  padding: 8px 18px;
  margin: 0 2px 4px 2px;
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
  background-image: linear-gradient(
    135deg,
    #1c6ea4 0%,
    #2388cb 39%,
    #2798e2 100%
  );
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
