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
              <p
                v-for="student in tab.scores"
                :key="student._id">
                {{ student }}
              </p>             
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      tabModel: 'tab0'
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
