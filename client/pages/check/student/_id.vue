<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Student</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="students"
            :search-input.sync="searchInput"
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
    <student-table v-if="model" :student="model" />
  </v-layout>
</template>

<script>
import StudentTable from '@/components/check/student/StudentTable'

export default {
  components: {
    StudentTable
  },
  middleware: 'auth',
  data() {
    return {
      model: null,
      Students: [],
      searchInput: ''
    }
  },
  computed: {
    students() {
      return this.Students
    }
  },
  watch: {
    model(val) {
      history.pushState(
        { urlPath: `/check/student/${val}` },
        '',
        `/check/student/${val}`
      )
    }
  },
  created() {
    if (this.$route.params.id) {
      this.model = this.$route.params.id
    }
    if (process.browser) {
      this.GetAllStudents()
    }
  },
  methods: {
    async GetAllStudents() {
      let model = this.model
      this.Students = await this.$axios.$get('/students/active')
      if (model) {
        let found = this.Students.find(function(student) {
          return student._id == model
        })
        this.searchInput = found.name
      }
    }
  }
}
</script>
