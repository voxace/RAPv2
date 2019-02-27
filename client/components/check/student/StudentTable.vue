<template>
  <v-flex xs12>
    <v-expansion-panel v-model="expansion" class="elevation-6" focusable>
      <v-expansion-panel-content v-for="(score, i) in scores" :key="i">
        <v-layout slot="header" class="title" align-content-space-between>
          <v-flex class="text-xs-left tab-heading" xs8>
            {{ ReturnPeriod(score) }}
          </v-flex>
          <v-spacer />
          <v-flex class="text-xs-right mr-4 tab-score" xs4>
            <span class="hidden-sm-and-down">
              Average:
            </span>
            {{ ReturnScore(score.average) }}
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
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.name }}</td>
                  <td class="hidden-sm-and-down">{{ props.item.subject }}</td>
                  <td>{{ props.item.subjectCode }}</td>
                  <td
                    v-if="props.item.score != 0 && props.item.score != null"
                    class="text-xs-center"
                  >
                    {{ props.item.score }}
                  </td>
                  <td v-else class="text-xs-center">
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
</template>

<script>
export default {
  props: {
    student: {
      type: String,
      default: null
    }
  },
  middleware: 'auth',
  data() {
    return {
      loading: false,
      Scores: [],
      headers: [
        {
          text: 'Teacher',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Subject',
          value: 'subject',
          align: 'left',
          class: 'table-heading hidden-sm-and-down'
        },
        {
          text: 'Code',
          value: 'subjectCode',
          align: 'left',
          class: 'table-heading'
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
    scores() {
      return this.Scores
    }
  },
  watch: {
    student() {
      this.GetScores()
    }
  },
  created() {
    if (process.browser) {
      this.GetScores()
    }
  },
  methods: {
    async GetScores() {
      this.loading = true
      this.Scores = await this.$axios.$get('/scores/student/' + this.student)
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
  background-color: #fdd835 !important;
}
.v-expansion-panel__container {
  border-top: 1px solid rgba(0, 0, 0, 0.35) !important;
}
@media only screen and (max-device-width: 875px) {
  .tab-heading {
    font-size: 16px !important;
  }
  .tab-score {
    font-size: 18px !important;
  }
}
</style>
