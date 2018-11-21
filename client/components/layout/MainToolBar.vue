<template>
  <v-toolbar
    app
    fixed
    color="indigo"
    dark>
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
          flat >
          {{ link.text }}
        </v-btn>

        <v-menu
          v-else
          :key="link.to"
          offset-y>
          <v-btn
            slot="activator"
            flat
          >
            {{ link.text }}
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(item, index) in link.menu"
              :key="index"
              @click="router.push(item.to)"
            >
              <nuxt-link
                :to="item.to"
                tag="v-list-tile-title">
                {{ item.text }}
              </nuxt-link>
            </v-list-tile>
          </v-list>
        </v-menu>

      </template>
    </v-toolbar-items>
    <v-toolbar-items class="hidden-md-and-up">
      <v-toolbar-side-icon slot="activator"/>
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
</style>
