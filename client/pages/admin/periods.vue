<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1 class="mb-2">RAP Periods</h1>
      <v-card>
        <v-toolbar flat color="yellow darken-1">
          <v-toolbar-title>
            Current Period: {{ GetCurrentPeriod }}
          </v-toolbar-title>
          <v-spacer />
          <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">
              New Period
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">New Period</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs4>
                      <v-select
                        :items="years"
                        v-model="editedItem.year"
                        label="Year"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-select
                        :items="terms"
                        v-model="editedItem.term"
                        label="Term"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-select
                        :items="weeks"
                        v-model="editedItem.week"
                        label="Week"
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" flat @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" flat @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="periods"
            :loading="loading"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.year }}</td>
                <td>{{ props.item.term }}</td>
                <td>{{ props.item.week }}</td>
                <td>
                  <v-checkbox
                    v-model="props.item.active"
                    class="ml-2"
                    @click.stop.prevent="activate(props.item)"
                  />
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
      loading: false,
      Periods: [],
      currentPeriod: { _id: '0', year: '0000', term: '0', week: '0' },
      years: [2020, 2019, 2018, 2017],
      terms: [1, 2, 3, 4],
      weeks: [5, 9],
      headers: [
        {
          text: 'Year',
          value: 'year',
          align: 'left',
          class: 'table-heading',
          sortable: false
        },
        {
          text: 'Term',
          value: 'term',
          align: 'left',
          class: 'table-heading',
          sortable: false
        },
        {
          text: 'Week',
          value: 'week',
          align: 'left',
          class: 'table-heading',
          sortable: false
        },
        {
          text: 'Active',
          value: 'active',
          align: 'center',
          class: 'table-heading',
          width: '60px',
          sortable: false
        }
      ],
      pagination: {
        rowsPerPage: 10
      },
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {}
    }
  },
  computed: {
    periods() {
      return this.Periods
    },
    GetCurrentPeriod() {
      if (this.currentPeriod._id != '0') {
        return (
          'Week ' +
          this.currentPeriod.week +
          ', Term ' +
          this.currentPeriod.term +
          ', ' +
          this.currentPeriod.year
        )
      } else {
        return 'Not Set'
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  created() {
    if (process.browser) {
      this.GetPeriods()
    }
  },
  methods: {
    async GetPeriods() {
      this.loading = true
      this.Periods = await this.$axios.$get('/period/all/')
      let p = this.Periods
      await this.$axios.$get('/period/current/').then(current => {
        p.forEach(period => {
          if (period._id == current._id) {
            period.active = true
          } else {
            period.active = false
          }
        })
        this.currentPeriod = Object.assign({}, current)
        console.log(this.currentPeriod)
      })
      this.$forceUpdate()
      this.loading = false
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.Periods[this.editedIndex], this.editedItem)
      } else {
        this.Periods.push(this.editedItem)
      }
      await this.$axios.$post('/period', {
        year: this.editedItem.year,
        term: this.editedItem.term,
        week: this.editedItem.week
      })
      this.GetPeriods()
      this.close()
    },
    activate(value) {
      let vm = this
      this.$axios.$post('/period/current/', { id: value._id }).then(() => {
        vm.GetPeriods()
      })
    }
  }
}
</script>
