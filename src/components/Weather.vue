<template>
  <section v-if="main">
    <div>Current Temperature: {{ fromKelvin(main.temp) }}</div>
    <div v-if="displayMode == 'minmax' || displayMode == 'full'">
      <div>Today's Min: {{ fromKelvin(main.temp_min) }}</div>
      <div>Today's Max: {{ fromKelvin(main.temp_max) }}</div>
    </div>
    <div v-if="displayMode == 'full'">
      <div>Humidity: {{ main.humidity }}</div>
      <div>Pressure: {{ main.pressure }}</div>
      <div>Sunrise: {{ fromUnixTime(sys.sunrise) }}</div>
      <div>Sunset: {{ fromUnixTime(sys.sunset) }}</div>
      <div>Taken at: {{ fromUnixTime(dt) }}</div>
    </div>
  </section>
  <section v-else>
    <div>Loading...</div>
  </section>
</template>

<script>
export default {
  name: "Weather",
  props: {
    displayMode: {
      type: String,
      default: "temp"
    },
    main: {
      temp: Number,
      humidity: Number,
      pressure: Number,
      temp_min: Number,
      temp_max: Number
    },
    dt: Number,
    sys: {
      sunrise: Number,
      sunset: Number
    }
  },
  methods: {
    fromKelvin(temp) {
      return (temp - 273.15).toFixed(2);
    },
    fromUnixTime(unixtime) {
      let locale = navigator.languages[0];
      // let locale = "en-US";
      let localtime = new Date(unixtime * 1000).toLocaleString(locale, {
        timeZoneName: "short"
      });
      return localtime.slice(localtime.indexOf(" ") + 1);
    }
  }
};
</script>
