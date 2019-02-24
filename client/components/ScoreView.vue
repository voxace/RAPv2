<template>
  <v-flex class="subheading text-xs-center">
    {{ scoredata.score }}
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
  }
}
</script>
