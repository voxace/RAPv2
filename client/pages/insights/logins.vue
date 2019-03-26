<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1>Student Logins: {{ total }}</h1>
    </v-flex>
    <v-flex id="chart-container" xs6>
      <canvas id="chart" />
    </v-flex>
    <v-flex class="mt-3">
      <v-card>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="students"
            :loading="loading"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>
                  <nuxt-link
                    :to="{ path: '/check/student/' + props.item.studentId }"
                  >
                    {{ props.item.name }}
                  </nuxt-link>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Chart from 'chart.js'

export default {
  middleware: 'auth',
  data() {
    return {
      Students: [],
      AllStudents: [],
      loading: false,
      headers: [
        {
          text: 'Student',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        }
      ],
      pagination: {
        sortBy: 'name',
        descending: true,
        rowsPerPage: 15
      }
    }
  },
  computed: {
    students() {
      return this.Students
    },
    chartData() {
      return [this.AllStudents.length, this.Students.length]
    },
    total() {
      return this.Students.length
    }
  },
  created() {
    if (process.browser) {
      this.GetStudentLogins()
    }
  },
  methods: {
    async GetStudentLogins() {
      this.loading = true
      this.Students = await this.$axios.$get('/period/logins/student/active')
      this.AllStudents = await this.$axios.$get('/students/period/active')
      await this.GenerateChart()
      this.loading = false
    },
    async GenerateChart() {
      let canvas = document.getElementById('chart')
      let ctx = canvas.getContext('2d')
      let data = this.chartData
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Students', 'Logins This Period'],
          datasets: [
            {
              label: 'Count',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          rsponsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          }
        }
      })
    }
  }
}
</script>

<style>
#chart-container {
  position: relative;
  margin: 10px;
  height: 80vh;
  width: 100%;
}
</style>
