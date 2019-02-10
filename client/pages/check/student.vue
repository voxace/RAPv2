<template>
  <v-layout
    wrap
    align-content-start>
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Student</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="students"
            :loading="loading"
            item-text="name"
            item-value="_id"
            placeholder="Name"
            color="indigo"
            autofocus
            clearable
            height="36px"
            @keyup.enter="GetScores"
          >
            <v-btn
              slot="append-outer"
              :loading="loading"
              small
              outline
              color="indigo"
              @click="GetScores"
            >
              SEARCH
            </v-btn>
          </v-autocomplete>
        </v-card-text>
      </v-card>
    </v-flex>
    <student-table
      v-if="model"
      :student="model" />
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
      loading: false,
      Students: []
    }
  },
  computed: {
    students() {
      return this.Students
    }
  },
  created() {
    if (process.browser) {
      this.GetAllStudents()
    }
  },
  methods: {
    async GetAllStudents() {
      this.Students = await this.$axios.$get('/students/active')
    }
  }
}
</script>
