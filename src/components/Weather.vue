<template>
  <section v-if="main">
    <div>
      Current Temperature: {{ temps.current | round }}
      °{{ scale }}
    </div>
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
    }
  }
};
</script>
