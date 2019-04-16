<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card class="elevation-6">
        <v-tabs
          v-model="tabModel"
          color="yellow darken-1"
          class="mt-3"
          centered
          grow
          show-arrows
          slider-color="indigo"
        >
          <v-tab
            v-for="(tab, index) in scores"
            :key="tab._id"
            :href="'#year' + tab._id"
            class="tab-heading"
            @click="SetYearGroup(tab._id, index)"
          >
            {{ tab._id }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabModel">
          <v-tab-item
            v-for="tab in scores"
            :key="tab._id"
            :value="'year' + tab._id"
          >
            <v-data-table
              :headers="headers"
              :items="tab.scores"
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
                  <td class="text-xs-center">
                    {{ ReturnScore(props.item.average) }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import ScoreView from '@/components/ScoreView'
import StudentPreview from '@/components/StudentPreview'

export default {
  components: {
    ScoreView,
    StudentPreview
  },
  middleware: 'auth',
  data() {
    return {
      tabModel: '',
      currentYearGroupId: null,
      currentYearGroupIndex: 0,
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
          text: 'Name',
          value: '_id',
          align: 'left',
          sortable: true,
          class: 'table-heading'
        },
        {
          text: 'Average',
          value: 'average',
          align: 'center',
          sortable: true,
          width: '60px',
          class: 'table-heading'
        }
      ],
      pagination: {
        sortBy: 'average',
        descending: true,
        rowsPerPage: 25
      },
      Scores: [],
      loading: false
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
  created() {
    if (process.browser) {
      this.GetScoresByGrade()
    }
  },
  methods: {
    async GetScoresByGrade() {
      this.loading = true
      this.Scores = await this.$axios.$get('/scores/students/grade')
      if (this.Scores && this.Scores.length > 0) {
        this.tabModel = 'year' + this.Scores[0]._id
      }
      this.loading = false
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
          let index = this.Scores[this.currentYearGroupIndex].scores
            .map(function(e) {
              return e.name
            })
            .indexOf(student.name)
          this.Scores[this.currentYearGroupIndex].scores.splice(index, 1)
        })
    },
    SetYearGroup(id, index) {
      this.currentYearGroupId = id
      this.currentYearGroupIndex = index
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

.score {
  padding-right: 16px !important;
}

.small-button {
  width: 22px;
  height: 22px;
}

.v-tabs__div {
  background: rgba(0, 0, 0, 0);
  transition: 0.4s ease-in-out;
}

.v-tabs__div:hover {
  background: rgba(0, 0, 0, 0.05);
  transition: 0.2s ease-in-out;
}

.v-tabs__container {
  height: 48px;
}

@media only screen and (min-device-width: 875px) and (max-device-width: 959px) {
  .v-tabs__container {
    height: 32px;
  }
}

@media only screen and (max-device-width: 875px) {
  .v-tabs__container {
    height: 40px;
  }
  .remove {
    padding: 0px 0px 0px 8px !important;
  }
  .student {
    padding: 4px !important;
  }
  .score {
    padding-right: 6px !important;
  }
  .tab-heading {
    font-size: 13px !important;
  }
}
@media only screen and (max-device-width: 875px) and (orientation: landscape) {
  .v-tabs__container {
    height: 32px;
  }
}
</style>
