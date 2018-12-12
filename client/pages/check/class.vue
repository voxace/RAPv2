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
    <v-flex xs12>
      <v-expansion-panel
        v-model="expansion"
        class="elevation-6"
        focusable
      >
        <v-expansion-panel-content
          v-for="(score,i) in scores"
          :key="i"
        >
          <v-layout
            slot="header"
            class="title"
            align-content-space-between
          >
            <v-flex
              class="text-xs-left"
              xs8
            >
              {{ ReturnPeriod(score) }}
            </v-flex>
            <v-spacer/>
            <v-flex
              class="text-xs-right mr-4"
              xs4
            >
              <span class="hidden-sm-and-down">Average: </span>{{ ReturnScore(score.average) }}
            </v-flex>
          </v-layout>
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="score.scores"
                :loading="loading"
                :pagination.sync="pagination"
                hide-actions
              >
                <template
                  slot="items"
                  slot-scope="props">
                  <tr>
                    <td>{{ props.item.name }}</td>
                    <td class="hidden-sm-and-down">{{ props.item.teacher }}</td>
                    <td
                      v-if="props.item.score != 0 && props.item.score != null"
                      class="text-xs-center"
                    >
                      {{ props.item.score }}
                    </td>
                    <td
                      v-else
                      class="text-xs-center"
                    >
                      -
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      model: null,
      loading: false,
      SubjectCodes: [],
      Scores: [],
      headers: [
        {
          text: 'Student',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Teacher',
          value: 'teacher',
          align: 'left',
          class: 'table-heading hidden-sm-and-down'
        },
        {
          text: 'Score',
          value: 'score',
          align: 'center',
          width: '60px',
          class: 'table-heading'
        }
      ],
      pagination: {
        sortBy: 'score',
        descending: true,
        rowsPerPage: -1
      },
      expansion: null
    }
  },
  computed: {
    subjectCodes() {
      return this.SubjectCodes
    },
    scores() {
      return this.Scores
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
    },
    async GetScores() {
      this.loading = true
      this.Scores = await this.$axios.$get('/scores/subject/' + this.model)
      setTimeout(() => {
        this.expansion = 0
        this.loading = false
      }, 100)
    },
    ReturnPeriod(score) {
      return (
        score._id[0].year +
        ', Term ' +
        score._id[0].term +
        ', Week ' +
        score._id[0].week
      )
    },
    ReturnScore(score) {
      if (score == 0 || score == null) {
        return '0.00'
      } else {
        return score.toFixed(2)
      }
    }
  }
}
</script>

<style>
.v-expansion-panel__header {
  background-color: #efefef !important;
}
</style>
