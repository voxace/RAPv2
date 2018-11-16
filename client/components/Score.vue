<template>
  <v-flex xs12>
    <v-btn-toggle
      v-model="toggle_exclusive"
      class="toggle-group">

      <v-tooltip
        top
        open-delay="800"
        close-delay="0">
        <v-btn
          slot="activator"
          flat
          icon>
          1
        </v-btn>
        Unsatisfactory Performance
      </v-tooltip>

      <v-tooltip
        top
        open-delay="800"
        close-delay="0">
        <v-btn
          slot="activator"
          flat
          icon>
          2
        </v-btn>
        Of Concern
      </v-tooltip>

      <v-tooltip
        top
        open-delay="800"
        close-delay="0">
        <v-btn
          slot="activator"
          flat
          icon>
          3
        </v-btn>
        Good
      </v-tooltip>

      <v-tooltip
        top
        open-delay="800"
        close-delay="0">
        <v-btn
          slot="activator"
          flat
          icon>
          4
        </v-btn>
        Excellent
      </v-tooltip>

      <v-tooltip
        top
        open-delay="800"
        close-delay="0">
        <v-btn
          slot="activator"
          flat
          icon>
          5
        </v-btn>
        Outstanding
      </v-tooltip>

    </v-btn-toggle>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    setScore(score) {
      // set score here
    },
    getScore() {
      // get score here
    }
  }
}
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
