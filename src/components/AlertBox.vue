<template>
  <div class="alert">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "alert-box"
};
</script>

<style>
div.alert {
  display: grid;
  justify-items: center;
  font-size: 1.2rem;
  width: 100%;
  background: #4caf50;
  color: #fff;
}

div.info {
  background: #2196f3;
}

div.error {
  background: #f44336;
}
</style>
