<template>
  <v-layout>
    <v-flex>
      <h1>{{ user.name }}</h1>
      <div v-if="user.type=='teacher'">
        <p>Enter a score from 1-5 according to the <nuxt-link to="/rubric">rubric</nuxt-link>. Leave the score blank or remove the student from the class if they do not qualify for a score (e.g. left school, have not attended your class). Clicking the button a second time will also remove the score.</p>
        <score-table :user="user.user_id"/>
      </div>
      <div v-if="user.type=='student'">
        <student-table
          :student="user.user_id"
          class="mt-3" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import ScoreTable from '@/components/ScoreTable'
import StudentTable from '@/components/check/student/StudentTable'

export default {
  components: {
    ScoreTable,
    StudentTable
  },
  middleware: 'auth',
  computed: {
    user() {
      return this.$store.state.auth
    }
  }
}
</script>

<style>
</style>
