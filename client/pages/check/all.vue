<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card>
        <v-toolbar flat color="yellow darken-1">
          <v-toolbar-title>
            Average Scores: All Students
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="computedHeaders"
            :items="scores"
            :loading="loading"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td v-if="editing" class="remove">
                  <v-btn
                    fab
                    dark
                    class="small-button"
                    color="error"
                    @click="RemoveStudent(props.item)"
                  >
                    <v-icon dark size="16px">
                      remove
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  <student-preview
                    :name="props.item.name"
                    :id="props.item._id"
                    :num="props.item.studentNum"
                  />
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
import StudentPreview from '@/components/StudentPreview'

export default {
  components: {
    StudentPreview
  },
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
          text: '',
          value: 'delete',
          align: 'center',
          width: '10px',
          sortable: false,
          class: 'table-heading'
        },
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
    },
    editing() {
      if (this.$store.state.auth.access == 2) {
        return true
      } else {
        return false
      }
    },
    computedHeaders() {
      if (!this.editing) {
        return this.headers.filter(header => header.text !== '')
      } else {
        return this.headers
      }
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
        return ' - '
      } else {
        return score.toFixed(2)
      }
    },
    async RemoveStudent(student) {
      await this.$axios
        .$delete('/scores/' + student._id + '/active')
        .then(() => {
          let index = this.Scores.map(function(e) {
            return e.name
          }).indexOf(student.name)
          this.Scores.splice(index, 1)
        })
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
