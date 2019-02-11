<template>
  <v-layout
    wrap
    align-content-start>
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Class Code</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="subjectCodes"
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
    <class-table
      v-if="model"
      :subject="model"
    />
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
      SubjectCodes: []
    }
  },
  computed: {
    subjectCodes() {
      return this.SubjectCodes
    }
  },
  created() {
    if (process.browser) {
      this.GetAllSubjectCodes()
    }
  },
  methods: {
    async GetAllSubjectCodes() {
      this.SubjectCodes = await this.$axios.$get('/subject/code/all')
    }
  }
}
</script>
