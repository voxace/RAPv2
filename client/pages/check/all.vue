<template>
  <v-flex xs12>
    <v-card>
      <v-toolbar flat color="yellow darken-1">
        <v-toolbar-title>
          Average Scores: All Students
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="scores"
          :loading="loading"
          :pagination.sync="pagination"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item._id }}</td>
              <td>{{ props.item.year }}</td>
              <td
                v-if="props.item.average != 0 && props.item.average != null"
                class="text-xs-center"
              >
                {{ props.item.average }}
              </td>
              <td v-else class="text-xs-center">
                -
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
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
          value: '_id',
          align: 'left',
          class: 'table-heading',
          sortable: true
        },
        {
          text: 'Year',
          value: 'year',
          align: 'left',
          class: 'table-heading',
          sortable: true
        },
        {
          text: 'Average',
          value: 'average',
          align: 'center',
          width: '60px',
          class: 'table-heading',
          sortable: true
        }
      ],
      pagination: {
        sortBy: 'average',
        descending: true,
        rowsPerPage: 25
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
      this.Scores = await this.$axios.$get('/scores/students/all')
      setTimeout(() => {
        this.expansion = 0
        this.loading = false
      }, 100)
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
