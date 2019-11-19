<template>
  <v-flex xs12>
    <v-expansion-panel v-model="expansion" class="elevation-6 mb-3" focusable>
      <v-expansion-panel-content>
        <v-layout slot="header" class="title" align-content-space-between>
          <v-flex class="text-xs-left tab-heading" xs4>
            Overall
          </v-flex>
          <v-spacer />
          <v-flex class="text-xs-right mr-4 tab-score" xs8>
            <span class="overall-score"
              >{{ GetYear }} Average: {{ AverageScore }}</span
            >
          </v-flex>
        </v-layout>
        <v-card>
          <v-card-text>
            <canvas id="chart"></canvas>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    scores: {
      type: Array,
      default: null
    }
  },
  middleware: 'auth',
  data() {
    return {
      loading: false,
      expansion: 0,
      chartScores: {
        period: [],
        average: []
      }
    }
  },
  computed: {
    GetYear() {
      let d = new Date()
      return d.getFullYear()
    },
    AverageScore() {
      let total = 0
      let count = 0
      this.scores.forEach(score => {
        if (score._id[0].year == '2019') {
          total += score.average
          count++
        }
      })
      if (count > 0) {
        return (total / count).toFixed(1)
      } else {
        return '0.00'
      }
    }
  },
  mounted() {
    if (process.browser) {
      this.GetChartScores()
    }
  },
  methods: {
    GetChartScores() {
      this.scores.forEach(score => {
        this.chartScores.period.push(this.ReturnPeriod(score))
        this.chartScores.average.push(score.average.toFixed(2))
      })
      this.chartScores.period = this.chartScores.period.slice(0, 8)
      this.chartScores.average = this.chartScores.average.slice(0, 8)
      this.chartScores.period.reverse()
      this.chartScores.average.reverse()
      this.GenerateChart()
    },
    ReturnPeriod(score) {
      return (
        score._id[0].year + ',T' + score._id[0].term + ',W' + score._id[0].week
      )
    },
    async GenerateChart() {
      let canvas = document.getElementById('chart')
      let ctx = canvas.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartScores.period,
          datasets: [
            {
              label: 'Average',
              data: this.chartScores.average,
              backgroundColor: 'rgba(63, 81, 181, 1)',
              borderColor: 'rgba(63, 81, 181, 1)',
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            }
          ]
        },
        options: {
          aspectRatio: 6,
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 1,
                  max: 5
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.overall-score {
  font-weight: 900;
  font-size: 21px;
}
</style>
