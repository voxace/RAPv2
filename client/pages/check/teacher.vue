<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Teacher</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="teachers"
            item-text="name"
            item-value="_id"
            placeholder="Name"
            color="indigo"
            autofocus
            clearable
            height="36px"
          />
        </v-card-text>
      </v-card>
    </v-flex>
    <score-table v-if="model && editing" :user="model" />
    <score-table-view v-if="model && !editing" :user="model" />
  </v-layout>
</template>

<script>
import ScoreTable from '@/components/ScoreTable'
import ScoreTableView from '@/components/ScoreTableView'

export default {
  components: {
    ScoreTable,
    ScoreTableView
  },
  middleware: 'auth',
  data() {
    return {
      model: null,
      Teachers: [],
      RapActiveStatus: false
    }
  },
  computed: {
    teachers() {
      return this.Teachers
    },
    editing() {
      if (this.$store.state.auth.access == 2) {
        return true
      } else if (
        this.model == this.$store.state.auth.user_id &&
        this.RapActiveStatus == true
      ) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {},
  created() {
    if (process.browser) {
      this.GetAllTeachers()
      this.GetActiveStatus()
    }
  },
  methods: {
    async GetAllTeachers() {
      this.Teachers = await this.$axios.$get('/teachers/names')
    },
    async GetActiveStatus() {
      let status = await this.$axios.$get('/admin/active-status')
      this.RapActiveStatus = status.isRapActive
    }
  }
}
</script>
