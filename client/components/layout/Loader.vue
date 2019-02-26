<template>
  <div class="full-height-container">
    <div class="full-height-center">
      <v-progress-circular :size="70" :width="7" color="indigo" indeterminate />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.full-height-container {
  position: absolute;
  z-index: 100;
  height: 100vh;
  top: 8px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: white;
  width: 100vw;
}
.full-height-center {
  width: 70px;
  height: 70px;
  padding: 0px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -35px 0 0 -35px;
}
</style>
