<template>
  <v-layout>
    <v-flex>

      <v-toolbar
        color="yellow darken-1"
        extended
        fixed
        app
        style="z-index: 1;">
        <v-tabs
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

      <v-tabs-items v-model="tabModel">
        <v-tab-item
          v-for="(tab, index) in scores"
          :key="tab._id"
          :value="'tab' + index">
          <v-card flat>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="tab.scores"
                class="elevation-8"
                hide-actions
              >
                <template
                  slot="items"
                  slot-scope="props">
                  <tr>
                    <td :id="props.item.studentId">{{ props.item.name }}</td>
                    <td class="text-xs-right">
                      <score
                        :data="props.item"/>
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
      ]
    }
  },
  computed: {
    scores() {
      return this.$store.state.scores
    }
  },
  created() {
    if (process.browser) {
      this.$store.dispatch('getScores')
    }
  }
}
</script>

<style>
.table-heading {
  font-size: 16px !important;
}
</style>
