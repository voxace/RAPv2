<template>
  <v-layout>
    <v-flex>
      <h1>David Steedman</h1>
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
            :key="tab._id"
            :href="'#tab' + index">
            {{ tab._id }}
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tabModel" >
          <v-tab-item
            v-for="(tab, index) in scores"
            :key="tab._id"
            :value="'tab' + index">
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
                  <td :id="props.item.studentId">{{ props.item.name }}</td>
                  <td class="text-xs-right">
                    <score
                      :scoredata="props.item" />
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
import Score from '@/components/Score'

export default {
  components: {
    Score
  },
  middleware: 'auth',
  data() {
    return {
      tabModel: 'tab0',
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
          class: 'table-heading'
        }
      ],
      Scores: {}
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
  created() {
    if (process.browser) {
      this.GetScoresByTeacher()
    }
  },
  methods: {
    async GetScoresByTeacher() {
      let user_id = this.$store.state.auth.user_id
      this.Scores = await this.$axios.$get(
        '/scores/teacher/' + user_id + '/active'
      )
    }
  }
}
</script>

<style>
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
}
@media only screen and (max-device-width: 875px) and (orientation: landscape) {
  .v-tabs__container {
    height: 32px;
  }
}
</style>
