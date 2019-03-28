<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1>Teacher Completion: {{ total }}%</h1>
    </v-flex>
    <v-flex xs12 class="mt-3">
      <v-card>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="teachers.incomplete"
            :loading="loading"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>
                  <nuxt-link
                    :to="{ path: '/check/teacher/' + props.item.teacherId }"
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
export default {
  middleware: 'auth',
  data() {
    return {
      Teachers: [],
      loading: false,
      headers: [
        {
          text: 'Teacher',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        }
      ],
      pagination: {
        sortBy: 'name',
        descending: false,
        rowsPerPage: 25
      }
    }
  },
  computed: {
    teachers() {
      return this.Teachers
    },
    total() {
      return this.Teachers.percentage
    }
  },
  created() {
    if (process.browser) {
      this.GetTeachers()
    }
  },
  methods: {
    async GetTeachers() {
      this.loading = true
      this.Teachers = await this.$axios.$get('/admin/check')
      this.loading = false
    }
  }
}
</script>
