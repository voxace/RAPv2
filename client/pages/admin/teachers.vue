<template>
  <v-layout
    wrap
    align-content-start
  >
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="teachers"
            :loading="loading"
            :pagination.sync="pagination"
            hide-actions
          >
            <template
              slot="items"
              slot-scope="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.faculty }}</td>
                <td>{{ props.item.access }}</td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="saveItem(props.item)"
                  >
                    save
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(props.item)"
                  >
                    delete
                  </v-icon>
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
      Teachers: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Username',
          value: 'username',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Faculty',
          value: 'faculty',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Access',
          value: 'access',
          align: 'center',
          width: '60px',
          class: 'table-heading'
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          width: '60px',
          class: 'table-heading',
          sortable: false
        }
      ],
      pagination: {
        sortBy: 'score',
        descending: true,
        rowsPerPage: -1
      }
    }
  },
  computed: {
    teachers() {
      return this.Teachers
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
      this.Teachers = await this.$axios.$get('/teachers/all/')
      this.loading = false
    }
  }
}
</script>
