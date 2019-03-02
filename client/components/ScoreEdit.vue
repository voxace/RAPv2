<template>
  <v-flex xs12>
    <v-btn-toggle v-model="toggle_exclusive" class="toggle-group">
      <v-btn flat icon @click="setScore(1)">1</v-btn>
      <v-btn flat icon @click="setScore(2)">2</v-btn>
      <v-btn flat icon @click="setScore(3)">3</v-btn>
      <v-btn flat icon @click="setScore(4)">4</v-btn>
      <v-btn flat icon @click="setScore(5)">5</v-btn>
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
      if (score == this.toggle_exclusive + 1) {
        score = 0
      }
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

@media only screen and (max-device-width: 875px) {
  button {
    height: 26px !important;
    width: 26px !important;
    margin-top: 2px !important;
    font-size: 16px !important;
  }
}
</style>
