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
          icon
          type="button"
          @click="setScore(1)">
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
          icon
          @click="setScore(2)">
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
          icon
          @click="setScore(3)">
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
          icon
          @click="setScore(4)">
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
          icon
          @click="setScore(5)">
          5
        </v-btn>
        Outstanding
      </v-tooltip>

    </v-btn-toggle>
  </v-flex>
</template>

<script>
export default {
  props: {
    scoredata: {
      type: Object,
      default: function() {
        return { score: 0 }
      }
    }
  },
  data() {
    return {
      toggle_exclusive: 0
    }
  },
  created() {
    this.toggle_exclusive = this.scoredata.score - 1
  },
  methods: {
    async setScore(score) {
      let result = await this.$axios.$patch('/score/id', {
        id: this.scoredata._id,
        score: score
      })
      this.toggle_exclusive = result.score - 1
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
