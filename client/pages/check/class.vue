<template>
  <v-layout
    wrap
    align-content-start>
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Subject Code</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="subjectCodes"
            :loading="loading"
            item-text="code"
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
      loading: false,
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
