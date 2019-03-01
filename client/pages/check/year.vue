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
            v-for="tab in scores"
            :key="tab._id"
            :href="'#year' + tab._id"
            class="tab-heading"
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
                  <td class="student">{{ props.item._id }}</td>
                  <td class="text-xs-center">{{ props.item.average }}</td>
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

export default {
  components: {
    ScoreView
  },
  middleware: 'auth',
  data() {
    return {
      tabModel: '',
      headers: [
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
