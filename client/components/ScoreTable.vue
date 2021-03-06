<template>
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
          :key="tab._id.code"
          :href="'#' + tab._id.code"
          class="tab-heading"
          @click="SetSubject(tab._id.subjectId, index)"
        >
          {{ tab._id.code }}
        </v-tab>
        <v-tooltip left>
          <!-- ADD CLASS DIALOG -->
          <v-dialog
            slot="activator"
            v-model="dialog"
            persistent
            max-width="600px"
          >
            <v-btn slot="activator" flat icon>
              <v-icon>add</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Add Missing Class</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="addSubjectModel"
                        :items="subjectCodes"
                        label="Class"
                        item-text="code"
                        item-value="_id"
                        clearable
                        autofocus
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" flat @click="dialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="!addSubjectModel"
                  color="blue darken-1"
                  flat
                  @click="AddClass"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          Add Class
        </v-tooltip>
      </v-tabs>
      <v-tabs-items v-model="tabModel">
        <v-tab-item
          v-for="tab in scores"
          :key="tab._id.code"
          :value="tab._id.code"
        >
          <v-data-table
            :headers="headers"
            :items="tab.scores"
            :loading="loading"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="remove">
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
                    :id="props.item.studentId"
                    :num="props.item.studentNum"
                  />
                </td>
                <td class="text-xs-right score">
                  <score-edit :scoredata="props.item" />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
      <v-layout
        align-center
        align-content-center
        justify-center
        wrap
        class="px-2"
      >
        <v-flex sm12 md8 class="px-2">
          <v-autocomplete
            id="autocomplete-students"
            v-model="selectedStudent"
            :items="students"
            :loading="loading"
            item-text="name"
            item-value="_id"
            placeholder="Add Missing Student"
            color="indigo"
            clearable
            height="36px"
            class="mt-2"
            @keyup.enter="GetScores"
          />
        </v-flex>
        <v-flex sm6 md2 class="px-2">
          <v-btn
            :disabled="AddStudentButtonEnabled"
            block
            color="info"
            @click="AddStudent"
          >
            Add Student
          </v-btn>
        </v-flex>
        <v-flex md2 sm6 class="px-2">
          <v-btn block color="error" @click="RemoveClass">
            Remove {{ currentClass }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import ScoreEdit from '@/components/ScoreEdit'
import StudentPreview from '@/components/StudentPreview'

export default {
  components: {
    ScoreEdit,
    StudentPreview
  },
  middleware: 'auth',
  props: {
    user: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tabModel: '',
      dialog: false,
      SubjectCodes: [],
      addSubjectModel: null,
      currentClassId: '',
      currentClassIndex: 0,
      currentClassGrade: '',
      selectedStudent: null,
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
          value: 'name',
          align: 'left',
          sortable: false,
          class: 'table-heading'
        },
        {
          text: 'Score',
          value: 'score',
          align: 'center',
          sortable: false,
          width: '100px',
          class: 'table-heading mr-0'
        }
      ],
      Scores: [
        {
          _id: {
            code: 'Loading...',
            subjectId: '00000'
          },
          scores: [
            {
              _id: '000000',
              name: 'Loading',
              studentId: '00000',
              score: 0
            }
          ]
        }
      ],
      Students: []
    }
  },
  computed: {
    scores() {
      return this.Scores
    },
    subjectCodes() {
      return this.SubjectCodes
    },
    loading() {
      return this.$store.state.loading
    },
    students() {
      if (this.scores && this.scores.length > 0) {
        let filteredStudents = []
        for (var i = 0; i < this.Students.length; i++) {
          let currentStudent = this.Students[i].name
          let found = false
          for (
            var j = 0;
            j < this.scores[this.currentClassIndex].scores.length;
            j++
          ) {
            let duplicateStudent = this.scores[this.currentClassIndex].scores[j]
              .name
            if (currentStudent == duplicateStudent) {
              found = true
            }
          }
          if (!found) {
            filteredStudents.push(this.Students[i])
          }
        }
        return filteredStudents
      } else {
        return this.Students
      }
    },
    currentClass() {
      return this.tabModel
    },
    AddStudentButtonEnabled() {
      return this.selectedStudent == null
    }
  },
  watch: {
    user: function(val) {
      if (val && process.browser) {
        this.GetScoresByTeacher()
      }
    }
  },
  created() {
    if (process.browser) {
      this.GetScoresByTeacher()
      this.GetAllStudents()
      this.GetAllSubjectCodes()
    }
  },
  methods: {
    async GetAllStudents() {
      this.Students = await this.$axios.$get('/students/all')
    },
    async GetScoresByTeacher() {
      if (this.user) {
        this.$store.commit('setLoading', true)
        this.Scores = null
        this.Scores = await this.$axios.$get(
          '/scores/teacher/' + this.user + '/active'
        )
        if (this.Scores && this.Scores.length > 0) {
          this.tabModel = this.Scores[0]._id.code
          this.currentClassId = this.Scores[0]._id.subjectId
          this.currentClassGrade = this.Scores[0]._id.studentGrade
        }
        this.$store.commit('setLoading', false)
      }
    },
    async AddStudent() {
      await this.$axios
        .$post('/score', {
          studentId: this.selectedStudent,
          teacherId: this.user,
          periodId: 'active',
          subjectId: this.currentClassId,
          studentGrade: this.currentClassGrade
        })
        .then(student => {
          let newStudent = {
            _id: student._id,
            name: document.getElementById('autocomplete-students').value,
            studentId: student.studentId,
            score: student.score
          }
          this.Scores[this.currentClassIndex].scores.push(newStudent)
          this.selectedStudent = null
        })
    },
    async RemoveStudent(student) {
      await this.$axios
        .$post('/score/remove', {
          studentId: student.studentId,
          teacherId: this.user,
          periodId: 'active',
          subjectId: this.currentClassId
        })
        .then(() => {
          let index = this.Scores[this.currentClassIndex].scores
            .map(function(e) {
              return e.name
            })
            .indexOf(student.name)
          this.Scores[this.currentClassIndex].scores.splice(index, 1)
        })
    },
    async RemoveClass() {
      await this.$axios
        .$post('/subject/remove', {
          teacherId: this.user,
          periodId: 'active',
          subjectId: this.currentClassId
        })
        .then(() => {
          this.GetScoresByTeacher()
        })
    },
    async AddClass() {
      await this.$axios
        .$post('/subject/add', {
          teacherId: this.user,
          periodId: 'active',
          subjectId: this.addSubjectModel
        })
        .then(() => {
          this.GetScoresByTeacher()
          this.addSubjectModel = null
          this.dialog = false
        })
    },
    async GetAllSubjectCodes() {
      this.SubjectCodes = await this.$axios.$get('/subject/code/all')
    },
    SetSubject(id, index) {
      this.currentClassId = id
      this.currentClassIndex = index
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
