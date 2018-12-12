<template>
  <v-layout>
    <v-flex>
      <h1>{{ user }}</h1>
      <p>Enter a score from 1-5 according to the <nuxt-link to="/rubric">rubric</nuxt-link>. Leave the score blank or remove the student from the class if they do not qualify for a score (e.g. left school, have not attended your class). Clicking the button a second time will also remove the score.</p>
      <v-card class="elevation-6">
        <v-tabs
          v-model="tabModel"
          color="yellow darken-1"
          class="mt-3"
          centered
          grow
          fixed-tabs
          slider-color="indigo"
        >
          <v-tab
            v-for="(tab, index) in scores"
            :key="tab._id.code"
            :href="'#' + tab._id.code"
            @click="SetSubject(tab._id.subjectId, index)">
            {{ tab._id.code }}
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tabModel" >
          <v-tab-item
            v-for="tab in scores"
            :key="tab._id.code"
            :value="tab._id.code">
            <v-data-table
              :headers="headers"
              :items="tab.scores"
              :loading="loading"
              hide-actions
            >
              <template
                slot="items"
                slot-scope="props">
                <tr>
                  <td class="remove">
                    <v-btn
                      fab
                      dark
                      class="small-button"
                      color="error"
                      @click="RemoveStudent(props.item)"
                    >
                      <v-icon
                        dark
                        size="16px"
                      >
                        remove
                      </v-icon>
                    </v-btn>
                  </td>
                  <td class="student">{{ props.item.name }}</td>
                  <td class="text-xs-right score">
                    <score
                      :scoredata="props.item" />
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
          <v-flex
            sm12
            md8
            class="px-2"
          >
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
          <v-flex
            sm6
            md2
            class="px-2"
          >
            <v-btn
              :disabled="AddStudentButtonEnabled"
              block
              color="info"
              @click="AddStudent"
            >Add Student</v-btn>
          </v-flex>
          <v-flex
            md2
            sm6
            class="px-2"
          >
            <v-btn
              block
              color="error"
              @click="RemoveClass"
            >Remove {{ currentClass }}</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Score from '@/components/Score'

export default {
  components: {
    Score
  },
  middleware: 'auth',
  data() {
    return {
      tabModel: '',
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
      Scores: {},
      Students: []
    }
  },
  computed: {
    scores() {
      return this.Scores
    },
    loading() {
      return this.$store.state.loading
    },
    user() {
      return this.$store.state.auth.name
    },
    students() {
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
    },
    currentClass() {
      return this.tabModel
    },
    AddStudentButtonEnabled() {
      return this.selectedStudent == null
    }
  },
  created() {
    if (process.browser) {
      this.GetScoresByTeacher()
      this.GetAllStudents()
    }
  },
  methods: {
    async GetAllStudents() {
      this.Students = await this.$axios.$get('/students/active')
    },
    async GetScoresByTeacher() {
      this.$store.commit('setLoading', true)
      this.Scores = null
      let user_id = this.$store.state.auth.user_id
      this.Scores = await this.$axios.$get(
        '/scores/teacher/' + user_id + '/active'
      )
      this.tabModel = this.Scores[0]._id.code
      this.currentClassId = this.Scores[0]._id.subjectId
      this.currentClassGrade = this.Scores[0]._id.studentGrade
      this.$store.commit('setLoading', false)
    },
    async AddStudent() {
      await this.$axios
        .$post('/score', {
          studentId: this.selectedStudent,
          teacherId: this.$store.state.auth.user_id,
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
          teacherId: this.$store.state.auth.user_id,
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
    RemoveClass() {
      alert(this.currentClassId)
      // teacher id: user_id
      // period: active
      // class: currentClassId
    },
    SetSubject(id, index) {
      this.currentClassId = id
      this.currentClassIndex = index
    }
  }
}
</script>

<style>
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
}
@media only screen and (max-device-width: 875px) and (orientation: landscape) {
  .v-tabs__container {
    height: 32px;
  }
}
</style>
