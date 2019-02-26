<template>
  <v-toolbar app fixed color="indigo" dark>
    <nuxt-link to="/">
      <v-toolbar-title>Regular Assessment Program</v-toolbar-title>
    </nuxt-link>
    <v-spacer />
    <v-toolbar-items class="hidden-sm-and-down">
      <template v-for="link in activeLinks">
        <v-btn
          v-if="link.type == 'link'"
          :key="link.to"
          :to="link.to"
          exact
          flat
        >
          {{ link.text }}
        </v-btn>

        <v-menu v-else :key="link.to" transition="slide-y-transition" offset-y>
          <v-btn
            slot="activator"
            :class="{ 'v-btn--active': subIsActive(link.to) }"
            flat
          >
            {{ link.text }}
            <v-icon right class="arrow">
              arrow_drop_down
            </v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(item, index) in link.menu"
              :key="index"
              @click="$router.push(item.to)"
            >
              <nuxt-link :to="item.to" tag="v-list-tile-title">
                {{ item.text }}
              </nuxt-link>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar-items>
    <v-toolbar-items class="hidden-md-and-up">
      <v-toolbar-side-icon @click="openNavDrawer" />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    activeLinks: {
      type: Array,
      required: true
    }
  },
  methods: {
    openNavDrawer() {
      this.$store.commit('setNavDrawer', true)
    },
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input]
      return paths.some(path => {
        return this.$route.path.indexOf(path) === 0
      })
    }
  }
}
</script>

<style scoped>
a,
a:visited,
a:hover {
  color: white;
  text-decoration: none;
}
.arrow {
  margin: 0 -5px 0 5px;
}
</style>
