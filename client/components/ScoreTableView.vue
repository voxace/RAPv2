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
          v-for="tab in scores"
          :key="tab._id.code"
          :href="'#' + tab._id.code"
          class="tab-heading"
        >
          {{ tab._id.code }}
        </v-tab>
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
                <td class="student">{{ props.item.name }}</td>
                <td class="text-xs-right score">
                  <score-view :scoredata="props.item" />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-flex>
</template>

<script>
import ScoreView from '@/components/ScoreView'

export default {
  components: {
    ScoreView
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
    loading() {
      return this.$store.state.loading
    }
  },
  watch: {
    user: function(val) {
      if (val) {
        this.GetScoresByTeacher()
      }
    }
  },
  created() {
    if (process.browser) {
      this.GetScoresByTeacher()
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.table-heading {
  font-size: 16px !important;
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
  .student {
    padding: 4px !important;
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
