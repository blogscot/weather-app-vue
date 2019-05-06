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
    fetchWeatherData() {
      return {
        coord: { lon: 139, lat: 35 },
        sys: { country: "JP", sunrise: 1369769524, sunset: 1369821049 },
        weather: [
          {
            id: 804,
            main: "clouds",
            description: "overcast clouds",
            icon: "04n"
          }
        ],
        main: {
          temp: 289.5,
          humidity: 89,
          pressure: 1013,
          temp_min: 287.04,
          temp_max: 292.04
        },
        wind: { speed: 7.31, deg: 187.002 },
        rain: { "3h": 0 },
        clouds: { all: 92 },
        dt: 1369824698,
        id: 1851632,
        name: "Shuzenji",
        cod: 200
      };
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
