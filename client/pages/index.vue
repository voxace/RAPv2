<template>
  <v-layout>
    <v-flex>
      <h1>{{ user.name }}</h1>
      <div v-if="user.type == 'teacher'">
        <p>
          Enter a score from 1-5 according to the
          <nuxt-link to="/rubric">rubric</nuxt-link>. Leave the score blank or
          remove the student from the class if they do not qualify for a score
          (e.g. left school, have not attended your class). Clicking the button
          a second time will also remove the score.
        </p>
        <score-table v-if="RapActiveStatus" :user="user.user_id" />
        <score-table-view v-else :user="user.user_id" />
      </div>
      <div v-if="user.type == 'student'">
        <student-table :student="user.user_id" access="student" class="mt-3" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import ScoreTable from '@/components/ScoreTable'
import ScoreTableView from '@/components/ScoreTableView'
import StudentTable from '@/components/check/student/StudentTable'

export default {
  components: {
    ScoreTable,
    StudentTable,
    ScoreTableView
  },
  middleware: 'auth',
  data() {
    return {
      RapActiveStatus: false
    }
  },
  computed: {
    user() {
      return this.$store.state.auth
    }
  },
  created() {
    if (process.browser) {
      this.GetActiveStatus()
    }
  },
  methods: {
    async GetActiveStatus() {
      let status = await this.$axios.$get('/admin/active-status')
      this.RapActiveStatus = status.isRapActive
    }
  }
}
</script>
