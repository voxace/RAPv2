<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card>
        <v-toolbar flat color="yellow darken-1">
          <v-toolbar-title>
            Term Averages Above Four
          </v-toolbar-title>
          <v-spacer />
          <v-layout>
            <v-flex xs8 class="text-xs-right pt-3 subheading">
              Term:
            </v-flex>
            <v-flex xs1 class="ml-2">
              <v-select
                :items="terms"
                v-model="selectedTerm"
                placeholder="Term"
                @change="GetScores"
              ></v-select>
            </v-flex>
            <v-flex xs1 class="text-xs-right pt-3 subheading">
              Year:
            </v-flex>
            <v-flex xs1 class="ml-2">
              <v-select
                :items="years"
                v-model="selectedYear"
                placeholder="Year"
                @change="GetScores"
              ></v-select>
            </v-flex>
            <v-flex xs1 class="ml-3 mt-1">
              <v-btn
                :disabled="downloadDisabled"
                fab
                small
                color="primary"
                @click="DownloadCSV"
              >
                <v-icon dark>cloud_download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
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
                <td>
                  <nuxt-link :to="{ path: '/check/student/' + props.item._id }">
                    {{ props.item.name }}
                  </nuxt-link>
                </td>
                <td>{{ props.item.year }}</td>
                <td class="text-xs-center">
                  {{ ReturnScore(props.item.average) }}
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
export default {
  middleware: 'auth',
  data() {
    return {
      downloadDisabled: true,
      terms: [1, 2, 3, 4],
      years: [2018, 2019, 2020],
      selectedTerm: null,
      selectedYear: null,
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
        rowsPerPage: 500
      },
      expansion: null
    }
  },
  computed: {
    scores() {
      return this.Scores
    }
  },
  methods: {
    async GetScores() {
      if (this.selectedTerm != null && this.selectedYear != null) {
        this.loading = true
        this.Scores = await this.$axios.$get(
          `/scores/students/fours/${this.selectedYear}/${
            this.selectedTerm
          }/false`
        )
        setTimeout(() => {
          this.loading = false
          this.downloadDisabled = false
        }, 100)
      }
    },
    async DownloadCSV() {
      if (this.selectedTerm != null && this.selectedYear != null) {
        await this.$axios
          .$get(
            `/scores/students/fours/${this.selectedYear}/${
              this.selectedTerm
            }/true`
          )
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'fours.csv')
            document.body.appendChild(link)
            link.click()
          })
      }
    },
    ReturnScore(score) {
      if (score == 0 || score == null) {
        return ' - '
      } else {
        return score.toFixed(2)
      }
    }
  }
}
</script>

<style scoped>
.table-heading {
  font-size: 16px !important;
}

.v-btn {
  min-width: 0;
}

.remove {
  padding: 0px 0px 0px 10px !important;
}

.small-button {
  width: 22px;
  height: 22px;
}

@media only screen and (max-device-width: 875px) {
  .remove {
    padding: 0px 0px 0px 8px !important;
  }
  .student {
    padding: 4px !important;
  }
}
</style>
