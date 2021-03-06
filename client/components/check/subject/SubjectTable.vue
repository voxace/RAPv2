<template>
  <v-flex xs12>
    <v-expansion-panel v-model="expansion" class="elevation-6" focusable>
      <v-expansion-panel-content v-for="(score, i) in scores" :key="i">
        <v-layout slot="header" class="title" align-content-space-between>
          <v-flex class="text-xs-left tab-heading" xs8>
            {{ score._id }}
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
                  <td>
                    <student-preview
                      :name="props.item.studentName"
                      :id="props.item.studentId"
                      :num="props.item.studentNum"
                    />
                  </td>
                  <td class="hidden-sm-and-down">
                    <nuxt-link
                      :to="{ path: '/check/teacher/' + props.item.teacherId }"
                    >
                      {{ props.item.teacherName }}
                    </nuxt-link>
                  </td>
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
import StudentPreview from '@/components/StudentPreview'

export default {
  components: {
    StudentPreview
  },
  props: {
    subject: {
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
    scores() {
      return this.Scores
    }
  },
  watch: {
    subject() {
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
      this.Scores = await this.$axios.$get(
        '/scores/subject/name/' + this.subject + '/active'
      )
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

<style scoped>
@media only screen and (max-device-width: 875px) {
  .tab-heading {
    font-size: 16px !important;
  }
  .tab-score {
    font-size: 18px !important;
  }
}
</style>
