<template>
  <v-flex xs12>
    <v-btn-toggle
      v-model="toggle_exclusive"
      class="toggle-group">
      <v-btn
        flat
        icon>
        1
      </v-btn>
      <v-btn
        flat
        icon>
        2
      </v-btn>
      <v-btn
        flat
        icon>
        3
      </v-btn>
      <v-btn
        flat
        icon>
        4
      </v-btn>
      <v-btn
        flat
        icon>
        5
      </v-btn>
    </v-btn-toggle>
  </v-flex>
</template>

<script>
export default {}
</script>

<style scoped>
.toggle-group {
  background: transparent !important;
  box-shadow: none !important;
}

button {
  height: 30px !important;
  width: 30px !important;
  margin-top: 2px !important;
  font-size: 20px !important;
}
</style>
