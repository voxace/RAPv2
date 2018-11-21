<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
  >
    <v-list>
      <template v-for="link in activeLinks">
        <v-list-tile
          v-if="link.type == 'link'"
          :key="link.to"
          @click="$router.push(link.to)">
          <nuxt-link
            :to="link.to"
            tag="v-list-tile-title">
            {{ link.text }}
          </nuxt-link>
        </v-list-tile>
        <v-list-group
          v-else
          :key="link.to">
          <v-list-tile slot="activator">
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-for="(item, index) in link.menu"
            :key="index"
            @click="$router.push(item.to)">
            <nuxt-link
              :to="item.to"
              tag="v-list-tile-title">
              {{ item.text }}
            </nuxt-link>
          </v-list-tile>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    activeLinks: {
      type: Array,
      required: true
    }
  },
  computed: {
    drawer: {
      set(value) {
        this.$store.commit('setNavDrawer', value)
      },
      get() {
        return this.$store.state.navDrawer
      }
    }
  }
}
</script>
