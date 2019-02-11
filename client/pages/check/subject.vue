<template>
  <v-layout
    wrap
    align-content-start>
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Subject</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="subjects"
            :loading="loading"
            item-text="_id"
            item-value="_id"
            placeholder="Name"
            color="indigo"
            autofocus
            clearable
            height="36px"
            @keyup.enter="GetScores"
          />
        </v-card-text>
      </v-card>
    </v-flex>
    <class-table
      v-if="model"
      :subject="model"
    />
  </v-layout>
</template>

<script>
import SubjectTable from '@/components/check/subject/SubjectTable'

export default {
  components: {
    SubjectTable
  },
  middleware: 'auth',
  data() {
    return {
      model: null,
      loading: false,
      Subjects: []
    }
  },
  computed: {
    subjects() {
      return this.Subjects
    }
  },
  created() {
    if (process.browser) {
      this.GetAllSubjects()
    }
  },
  methods: {
    async GetAllSubjects() {
      this.Subjects = await this.$axios.$get('/subject/all')
    }
  }
}
</script>
