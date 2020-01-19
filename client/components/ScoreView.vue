<template>
  <v-flex class="subheading text-xs-center">
    {{ wordScore }}
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
  computed: {
    wordScore: function() {
      if (this.scoredata.score == 0) {
        return '-'
      } else if (this.scoredata.score == 1) {
        return 'Not Yet'
      } else if (this.scoredata.score == 2) {
        return 'Developing'
      } else if (this.scoredata.score == 3) {
        return 'Sometimes'
      } else if (this.scoredata.score == 4) {
        return 'Frequently'
      } else if (this.scoredata.score == 5) {
        return 'Always'
      } else {
        return ''
      }
    }
  }
}
</script>
