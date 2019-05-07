<template>
  <div id="app">
    <button @click="toggleDisplay()" v-if="state == 'Loaded'">{{ displayMode }}</button>
    <Weather
      v-if="state == 'Loaded'"
      :displayMode="displayMode"
      :main="weather.main"
      :dt="weather.dt"
      :sys="weather.sys"
    ></Weather>
    <p v-if="state == 'SeekingPermission'">Welcome to the Weather App</p>
    <p v-if="state == 'GeolocationNotSupported'">Geo-loacation not supported by browser</p>
    <p v-if="state == 'PermissionRejected'">Geo-loacation permission rejected by user</p>
    <p v-if="state == 'FetchWeatherDataFailed'">Failed to fetch weather data. Oh noes!</p>
    <p v-if="state == 'Loading'">Loading</p>
  </div>
</template>

<script>
import Weather from "./components/Weather";
import { setInterval } from "timers";

const updateInterval = 20 * 1000;

// const devServer = null;
const devServer = "http://localhost:3000/weather";

async function delay(amount) {
  return new Promise(resolve => setTimeout(() => resolve(), amount));
}

const states = [
  "SeekingPermission",
  "GeolocationNotSupported",
  "PermissionRejected",
  "Loading",
  "FetchWeatherDataFailed",
  "Loaded"
];
const SeekingPermission = 0;
const GeolocationNotSupported = 1;
const PermissionRejected = 2;
const Loading = 3;
const FetchWeatherDataFailed = 4;
const Loaded = 5;

const openWeatherMapPrefix = "https://api.openweathermap.org/data/2.5/weather?";

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
  methods: {
    async asyncFetchWeatherData() {
      return new Promise(resolve => {
        setTimeout(() => resolve(this.fetchWeatherData()), 200);
      });
    },
    async getWeatherData(position) {
      this.state = states[Loading];

      const {
        coords: { latitude, longitude }
      } = position;
      this.weatherAPIURL = `${openWeatherMapPrefix}lat=${latitude}&lon=${longitude}&APPID=${
        process.env.VUE_APP_WEATHER_API_KEY
      }`;

      try {
        this.weather = await this.asyncFetchWeatherData();
        this.state = states[Loaded];
      } catch (e) {
        this.state = states[FetchWeatherDataFailed];
      }
    },
    async fetchWeatherData() {
      const response = await fetch(devServer || this.weatherAPIURL).then(
        response => response.json()
      );
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
    }
  },
  data() {
    return {
      displayMode: "temp",
      weatherAPIURL: "",
      state: states[SeekingPermission],
      weather: {}
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
</style>
