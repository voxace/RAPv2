<template>
  <v-layout
    wrap
    align-content-start
  >
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Teacher</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="teachers"
            :loading="loading"
            item-text="name"
            item-value="_id"
            placeholder="Name"
            color="indigo"
            autofocus
            clearable
            height="36px"
            @keyup.enter="GetScores"
          >
            <v-btn
              slot="append-outer"
              :loading="loading"
              small
              outline
              color="indigo"
              @click="GetScores"
            >
              SEARCH
            </v-btn>
          </v-autocomplete>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
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
            {{ tab._id.code }}
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
                  <td
                    v-if="props.item.score != 0 && props.item.score != null"
                    class="text-xs-center"
                  >
                    {{ props.item.score }}
                  </td>
                  <td
                    v-else
                    class="text-xs-center"
                  >
                    -
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
      model: null,
      loading: false,
      Teachers: [],
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
    teachers() {
      return this.Teachers
    },
    scores() {
      return this.Scores
    }
  },
  created() {
    if (process.browser) {
      this.GetAllTeachers()
    }
  },
  methods: {
    async GetAllTeachers() {
      this.Teachers = await this.$axios.$get('/teachers')
    },
    async GetScores() {
      this.Scores = await this.$axios.$get(
        '/scores/teacher/' + this.model + '/active'
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
