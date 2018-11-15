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
          to="/rubric"
          exact
          flat>
          Rubric
        </v-btn>
        <v-btn
          to="/"
          exact
          flat>
          Enter Scores
        </v-btn>
        <v-btn flat>Check Scores</v-btn>
        <v-btn flat>Insights</v-btn>
        <v-btn flat>Admin</v-btn>
        <v-btn flat>Logout</v-btn>
      </v-toolbar-items>

      <v-toolbar-items class="hidden-md-and-up">
        <v-menu offset-y>
          <v-toolbar-side-icon slot="activator"/>
          <v-list>
            <nuxt-link
              tag="v-list-tile"
              to="/rubric">
              <v-list-tile-title>
                Rubric
              </v-list-tile-title>
            </nuxt-link>
            <nuxt-link
              tag="v-list-tile"
              to="/">
              <v-list-tile-title>
                Enter Scores
              </v-list-tile-title>
            </nuxt-link>
            <nuxt-link
              tag="v-list-tile"
              to="/check">
              <v-list-tile-title>
                Check Scores
              </v-list-tile-title>
            </nuxt-link>
            <nuxt-link
              tag="v-list-tile"
              to="/insights">
              <v-list-tile-title>
                Insights
              </v-list-tile-title>
            </nuxt-link>
            <nuxt-link
              tag="v-list-tile"
              to="/admin">
              <v-list-tile-title>
                Admin
              </v-list-tile-title>
            </nuxt-link>
            <nuxt-link
              tag="v-list-tile"
              to="/logout">
              <v-list-tile-title>
                Logout
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
    return {}
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
