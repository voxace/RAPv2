<template>
  <v-layout align-center>
    <v-flex>

      <v-toolbar
        color="yellow darken-1"
        extended
        fixed
        app
        style="z-index: 1;">
        <v-tabs
          v-if="!scores"
          slot="extension"
          color="yellow darken-1"
          centered
          slider-color="indigo">
          <v-tab>
            Loading...
          </v-tab>
        </v-tabs>

        <v-tabs
          v-else
          slot="extension"
          v-model="tabModel"
          color="yellow darken-1"
          class="mt-3"
          centered
          grow
          slider-color="indigo"
        >
          <v-tab
            v-for="(tab, index) in scores"
            :key="tab._id"
            :href="'#tab' + index">
            {{ tab._id }}
          </v-tab>
        </v-tabs>
      </v-toolbar>

      <div
        v-if="loading"
        class="full-height-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="indigo"
          indeterminate
        />
      </div>

      <v-tabs-items
        v-else
        v-model="tabModel" >
        <v-tab-item
          v-for="(tab, index) in scores"
          :key="tab._id"
          :value="'tab' + index">
          <v-card flat>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="tab.scores"
                :loading="loading"
                class="elevation-6"
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
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

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
      let user_id = this.$store.state.auth
      this.Scores = await this.$axios.$get('/scores/teacher/' + user_id)
    }
  }
}
</script>

<style>
.table-heading {
  font-size: 16px !important;
}
.full-height-center {
  width: 70px;
  height: 70px;
  padding: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -35px 0 0 -35px;
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
