<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1>Grade Averages</h1>
      <canvas id="chart" />
    </v-flex>
  </v-layout>
</template>

<script>
import Chart from 'chart.js'

export default {
  middleware: 'auth',
  data() {
    return {
      Scores: {}
    }
  },
  created() {
    if (process.browser) {
      this.GetAveragesByGrade()
    }
  },
  methods: {
    async GetAveragesByGrade() {
      this.loading = true
      this.Scores = await this.$axios.$get('/insights/grade')
      await this.GenerateChart()
      this.loading = false
    },
    async GenerateChart() {
      let canvas = document.getElementById('chart')
      let ctx = canvas.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.Scores.period,
          datasets: [
            {
              label: 'Year 7',
              data: this.Scores.year7,
              backgroundColor: 'rgba(255, 99, 132, 1)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            },
            {
              label: 'Year 8',
              data: this.Scores.year8,
              backgroundColor: 'rgba(255, 206, 86, 1)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            },
            {
              label: 'Year 9',
              data: this.Scores.year9,
              backgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            },
            {
              label: 'Year 10',
              data: this.Scores.year10,
              backgroundColor: 'rgba(255, 159, 64, 1)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            },
            {
              label: 'Year 11',
              data: this.Scores.year11,
              backgroundColor: 'rgba(127, 59, 194, 1)',
              borderColor: 'rgba(127, 59, 194, 1)',
              borderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointHitRadius: 12,
              fill: false
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false
                }
              }
            ]
          },
          legend: {
            display: true
          }
        }
      })
    }
  }
}
</script>
