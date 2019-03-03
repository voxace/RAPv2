<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Class Code</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="subjectCodes"
            :search-input.sync="searchInput"
            item-text="code"
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
    <class-table v-if="model" :subject="model" />
  </v-layout>
</template>

<script>
import ClassTable from '@/components/check/class/ClassTable'

export default {
  components: {
    ClassTable
  },
  middleware: 'auth',
  data() {
    return {
      model: null,
      SubjectCodes: [],
      searchInput: ''
    }
  },
  computed: {
    subjectCodes() {
      return this.SubjectCodes
    }
  },
  watch: {
    model(val) {
      history.pushState(
        { urlPath: `/check/class/${val}` },
        '',
        `/check/class/${val}`
      )
    }
  },
  created() {
    if (this.$route.params.id) {
      this.model = this.$route.params.id
    }
    if (process.browser) {
      this.GetAllSubjectCodes()
    }
  },
  methods: {
    async GetAllSubjectCodes() {
      let model = this.model
      this.SubjectCodes = await this.$axios.$get('/subject/code/all')
      if (model) {
        let found = this.SubjectCodes.find(function(subject) {
          return subject._id == model
        })
        this.searchInput = found.code
      }
    }
  }
}
</script>
