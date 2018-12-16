<template>
  <v-layout
    wrap
    align-content-start
  >
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Teacher</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="teachers"
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
    <score-table
      :user="model"
    />
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
    return {
      model: null,
      Teachers: []
    }
  },
  computed: {
    teachers() {
      return this.Teachers
    }
  },
  watch: {},
  created() {
    if (process.browser) {
      this.GetAllTeachers()
    }
  },
  methods: {
    async GetAllTeachers() {
      this.Teachers = await this.$axios.$get('/teachers')
    },
    GetScores() {
      //alert(this.model)
    }
  }
}
</script>

<style>
</style>
