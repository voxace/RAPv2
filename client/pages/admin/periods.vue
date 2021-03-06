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
          <v-btn
            v-if="RapActiveStatus"
            color="success"
            dark
            class="mb-2"
            @click="LockRap"
          >
            <v-icon left dark>lock_open</v-icon>
            Unlocked
          </v-btn>
          <v-btn v-else color="error" dark class="mb-2" @click="UnlockRap">
            <v-icon left dark>lock</v-icon>
            Locked
          </v-btn>
          <v-btn color="primary" dark class="mb-2" @click="save">
            New Period
          </v-btn>
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
                    class="ml-2 check-box"
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
      RapActiveStatus: true,
      loading: false,
      Periods: [],
      currentPeriod: {
        _id: '0',
        year: '0000',
        term: '0',
        week: '0',
        active: false
      },
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
      this.GetActiveStatus()
    }
  },
  methods: {
    async GetPeriods() {
      this.loading = true
      this.Periods = await this.$axios.$get('/period/all/')
      this.currentPeriod = Object.assign(
        {},
        await this.$axios.$get('/period/current/')
      )
      this.Periods.forEach(period => {
        if (period._id == this.currentPeriod._id) {
          period.active = true
        } else {
          period.active = false
        }
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
      await this.$axios.$post('/period', {})
      this.GetPeriods()
      this.close()
    },
    activate(value) {
      let vm = this
      this.$axios.$post('/period/current/', { id: value._id }).then(() => {
        vm.GetPeriods()
      })
    },
    async GetActiveStatus() {
      let status = await this.$axios.$get('/admin/active-status')
      this.RapActiveStatus = status.isRapActive
    },
    async LockRap() {
      await this.$axios
        .$post('/admin/active-status', {
          status: false
        })
        .then(() => {
          this.RapActiveStatus = false
        })
    },
    async UnlockRap() {
      await this.$axios
        .$post('/admin/active-status', {
          status: true
        })
        .then(() => {
          this.RapActiveStatus = true
        })
    }
  }
}
</script>

<style>
.v-input__slot {
  margin-top: 8px !important;
  margin-bottom: 0px !important;
}
</style>
