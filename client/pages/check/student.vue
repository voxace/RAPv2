<template>
  <v-layout
    wrap
    align-content-start>
    <v-flex
      xs12
      mb-3>
      <v-card class="elevation-6">
        <v-card-title class="title yellow darken-1">Student</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="students"
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
      <v-expansion-panel
        v-model="expansion"
        class="elevation-6"
        focusable
      >
        <v-expansion-panel-content
          v-for="(score,i) in scores"
          :key="i"
        >
          <div
            slot="header"
            class="title"
          >
            {{ ReturnPeriod(score) }}
          </div>
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="score.scores"
                :loading="loading"
                :pagination.sync="pagination"
                hide-actions
              >
                <template
                  slot="items"
                  slot-scope="props">
                  <tr>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.subject }}</td>
                    <td>{{ props.item.subjectCode }}</td>
                    <td
                      v-if="props.item.score != 0"
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
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      model: null,
      loading: false,
      Students: [],
      Scores: [],
      headers: [
        {
          text: 'Teacher',
          value: 'name',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Subject',
          value: 'subject',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Code',
          value: 'subjectCode',
          align: 'left',
          class: 'table-heading'
        },
        {
          text: 'Score',
          value: 'score',
          align: 'center',
          width: '60px',
          class: 'table-heading'
        }
      ],
      pagination: {
        sortBy: 'score',
        descending: true,
        rowsPerPage: -1
      },
      expansion: null
    }
  },
  computed: {
    students() {
      return this.Students
    },
    scores() {
      return this.Scores
    }
  },
  created() {
    if (process.browser) {
      this.GetAllStudents()
    }
  },
  methods: {
    async GetAllStudents() {
      this.Students = await this.$axios.$get('/students')
    },
    async GetScores() {
      this.loading = true
      this.Scores = await this.$axios.$get('/scores/student/' + this.model)
      setTimeout(() => {
        this.expansion = 0
        this.loading = false
      }, 100)
    },
    ReturnPeriod(score) {
      return (
        score._id[0].year +
        ', Term ' +
        score._id[0].term +
        ', Week ' +
        score._id[0].week
      )
    }
  }
}
</script>

<style>
.v-expansion-panel__header {
  background-color: #efefef !important;
}
</style>
