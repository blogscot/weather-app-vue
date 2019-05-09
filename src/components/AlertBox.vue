<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "alert-box"
};
</script>

<style>
div {
  display: grid;
  justify-items: center;
  font-size: 1.2rem;
  width: 100%;
  background: #4caf50;
  color: #fff;
}

.info {
  background: #2196f3;
}

.error {
  background: #f44336;
}
</style>
