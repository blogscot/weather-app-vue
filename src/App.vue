<template>
  <div id="app">
    <Weather
      v-if="state == 'Loaded'"
      minmax
      :main="weather.main"
      :dt="weather.dt"
      :sys="weather.sys"
    ></Weather>
    <p v-if="state == 'PermissionRejected'">
      Geo-loacation permission rejected by user
    </p>
    <p v-else-if="state == 'FetchWeatherDataFailed'">
      Failed to fetch weather data. Oh noes!
    </p>
    <p v-else-if="state == 'Loading'">Loading</p>
  </div>
</template>

<script>
import Weather from "./components/Weather";

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

export default {
  name: "App",
  components: {
    Weather
  },
  async created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherData,
        () => this.state = states[PermissionRejected]
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
      console.log(position);
      try {
        this.weather = await this.asyncFetchWeatherData();
        this.state = states[Loaded];
      } catch (e) {
        this.state = states[FetchWeatherDataFailed];
      }
    },
    async fetchWeatherData() {
      const response = await fetch("http://localhost:3000/weather").then(
        response => response.json()
      );
      return response[0];
    }
  },
  data() {
    return {
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
</style>
