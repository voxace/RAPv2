<template>
  <v-layout>
    <v-flex>
      <h1>{{ user.name }}</h1>
      <p>Enter a score from 1-5 according to the <nuxt-link to="/rubric">rubric</nuxt-link>. Leave the score blank or remove the student from the class if they do not qualify for a score (e.g. left school, have not attended your class). Clicking the button a second time will also remove the score.</p>
      <score-table :user="user.user_id"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Score from '@/components/Score'
import ScoreTable from '@/components/ScoreTable'

export default {
  components: {
    Score,
    ScoreTable
  },
  middleware: 'auth',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.state.auth
    }
  },
  created() {},
  methods: {}
}
</script>

<style>
</style>
