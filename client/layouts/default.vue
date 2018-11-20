<template>
  <v-app light>
    <v-toolbar
      app
      fixed
      color="indigo"
      dark>
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
      <v-container
        fluid
        fill-height>
        <div
          v-show="loading"
          class="full-height-container">
          <div class="full-height-center">
            <v-progress-circular
              :size="70"
              :width="7"
              color="indigo"
              indeterminate
            />
          </div>
        </div>
        <nuxt v-show="!loading"/>
      </v-container>
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
    },
    loading() {
      return this.$store.state.loading
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
.theme--light.application {
  background: #fff;
}
.full-height-container {
  position: absolute;
  z-index: 100;
  height: 100vh;
  top: 8px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: white;
  width: 100vw;
}
.full-height-center {
  width: 70px;
  height: 70px;
  padding: 0px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -35px 0 0 -35px;
}
</style>
