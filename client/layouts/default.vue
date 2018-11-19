<template>
  <v-app light>
    <v-toolbar
      fixed
      color="indigo"
      dark
      app>
      <nuxt-link
        to="/">
        <v-toolbar-title>Regular Assessment Program</v-toolbar-title>
      </nuxt-link>

      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="link in activeLinks"
          :key="link.to"
          :to="link.to"
          exact
          flat >
          {{ link.text }}
        </v-btn>
      </v-toolbar-items>

      <v-toolbar-items class="hidden-md-and-up">
        <v-menu offset-y>
          <v-toolbar-side-icon slot="activator"/>
          <v-list>
            <nuxt-link
              v-for="link in activeLinks"
              :key="link.to"
              :to="link.to"
              tag="v-list-tile" >
              <v-list-tile-title>
                {{ link.text }}
              </v-list-tile-title>
            </nuxt-link>
          </v-list>
        </v-menu>

      </v-toolbar-items>

    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { to: '/', text: 'Home', auth: true },
        { to: '/rubric', text: 'Rubric', auth: false },
        { to: '/check', text: 'Check Scores', auth: true },
        { to: '/insights', text: 'Insights', auth: true },
        { to: '/admin', text: 'Admin', auth: true },
        { to: '/logout', text: 'Logout', auth: true }
      ]
    }
  },
  computed: {
    activeLinks: function() {
      if (this.$store.state.auth) {
        return this.links
      } else {
        return this.links.filter(function(l) {
          return !l.auth
        })
      }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
