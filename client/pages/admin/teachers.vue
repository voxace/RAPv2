<template>
  <v-layout
    wrap
    align-content-start
  >
    <v-flex xs12>
      <v-card>
        <v-toolbar
          flat
          color="yellow darken-1"
        >
          <v-toolbar-title>Edit Teachers</v-toolbar-title>
          <v-spacer/>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <v-btn
              slot="activator"
              color="primary"
              dark
              class="mb-2"
            >
              New Teacher
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs6>
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="editedItem.username"
                        label="Username"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-select
                        :items="faculties"
                        v-model="editedItem.faculty"
                        label="Faculty"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-select
                        :items="accessLevels"
                        v-model="editedItem.access"
                        item-text="text"
                        item-value="value"
                        label="Access Level"
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="teachers"
            :loading="loading"
            :pagination.sync="pagination"
          >
            <template
              slot="items"
              slot-scope="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.faculty }}</td>
                <td>{{ GetAccessLevel(props.item.access) }}</td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                  >
                    edit
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
      accessLevels: [
        { text: 'None', value: 0 },
        { text: 'Teacher', value: 1 },
        { text: 'Administrator', value: 2 }
      ],
      faculties: [
        'English',
        'Mathematics',
        'Science',
        'TAS',
        'HSIE',
        'PDHPE',
        'CAPA',
        'Special Ed'
      ],
      Teachers: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
          align: 'left',
          class: 'table-heading',
          sort: '1'
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
          align: 'left',
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
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false
      },
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {}
    }
  },
  computed: {
    teachers() {
      return this.Teachers
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Teacher' : 'Edit Teacher'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
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
    },
    editItem(item) {
      this.editedIndex = this.Teachers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      const index = this.Teachers.indexOf(item)
      this.Teachers.splice(index, 1)
      this.$axios.$delete('/teacher/' + item._id)
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
        Object.assign(this.Teachers[this.editedIndex], this.editedItem)
      } else {
        this.Teachers.push(this.editedItem)
      }
      this.$axios.$post('/teacher', {
        teacher: this.editedItem
      })
      this.close()
    },
    GetAccessLevel(level) {
      if (level == 0) {
        return 'None'
      } else if (level == 1) {
        return 'Teacher'
      } else if (level == 2) {
        return 'Administrator'
      } else {
        return null
      }
    }
  }
}
</script>
