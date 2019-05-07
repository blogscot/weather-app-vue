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
    <p v-if="state == 'PermissionRejected'">Geo-loacation permission rejected by user</p>
    <p v-else-if="state == 'FetchWeatherDataFailed'">Failed to fetch weather data. Oh noes!</p>
    <p v-else-if="state == 'Loading'">Loading</p>
  </div>
</template>

<script>
import Weather from "./components/Weather";

// const devServer = null;
const devServer = "http://localhost:3000/weather";

const states = [
  "SeekingPermission",
  "PermissionRejected",
  "Loading",
  "FetchWeatherDataFailed",
  "Loaded"
];
const SeekingPermission = 0;
const PermissionRejected = 1;
const Loading = 2;
const FetchWeatherDataFailed = 3;
const Loaded = 4;

const openWeatherMapPrefix = "https://api.openweathermap.org/data/2.5/weather?";

export default {
  name: "App",
  components: {
    Weather
  },
  async created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherData,
        () => (this.state = states[PermissionRejected])
      );
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
