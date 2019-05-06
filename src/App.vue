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
    <p v-else-if="state == 'Loading'">Loading</p>
  </div>
</template>

<script>
import Weather from "./components/Weather";

const states = ["SeekingPermission", "PermissionRejected", "Loading", "Loaded"];
const SeekingPermission = 0;
const PermissionRejected = 1;
const Loading = 2;
const Loaded = 3;

export default {
  name: "App",
  components: {
    Weather
  },
  async created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherData,
        this.permissionRefused
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
      this.weather = await this.asyncFetchWeatherData();
      this.state = states[Loaded];
    },
    permissionRefused() {
      this.state = states[PermissionRejected];
    },
    async fetchWeatherData() {
      const response = await fetch("http://localhost:3000/weather")
      .then(response => response.json())
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
