<template>
  <section v-if="main">
    <div>Status: {{ status | capitalise }}</div>
    <div>Temperature: {{ temps.current | round }} °{{ scale }}</div>
    <div v-if="displayMode == 'minmax' || displayMode == 'full'">
      <div>Today's Min: {{ temps.min | round }}°{{ scale }}</div>
      <div>Today's Max: {{ temps.max | round }}°{{ scale }}</div>
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
    status: {
      type: String,
      required: true
    },
    displayMode: {
      type: String,
      default: "temp"
    },
    temps: {
      current: Number,
      min: Number,
      max: Number
    },
    main: {
      humidity: Number,
      pressure: Number
    },
    dt: Number,
    sys: {
      sunrise: Number,
      sunset: Number
    },
    scale: {
      type: String,
      default: "C"
    }
  },
  methods: {
    fromUnixTime(unixtime) {
      let locale = navigator.languages[0];
      let localtime = new Date(unixtime * 1000).toLocaleString(locale, {
        timeZoneName: "short"
      });
      return localtime.slice(localtime.indexOf(" ") + 1);
    }
  },
  filters: {
    round(number) {
      return Number(number).toFixed(1);
    },
    capitalise: function(value) {
      return (
        String(value)
          .charAt(0)
          .toUpperCase() + value.slice(1)
      );
    }
  }
};
</script>

<style>
section {
  border: rgba(22, 22, 22, 0.4) solid 1px;
  width: 200px;
  margin: 5px auto;
  padding: 1rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 221, 0.85);
  line-height: 1.43;
}
</style>
