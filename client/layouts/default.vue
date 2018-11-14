<template>
  <v-app light>
    <v-toolbar
      fixed
      color="indigo"
      dark
      app>
      <nuxt-link
        to="/"
        exact>
        <v-toolbar-title>Regular Assessment Program</v-toolbar-title>
      </nuxt-link>

      <v-spacer />
      <v-toolbar-items>
        <v-btn flat>Rubric</v-btn>
        <v-btn flat>Enter Scores</v-btn>
        <v-btn flat>Check Scores</v-btn>
        <v-btn flat>Insights</v-btn>
        <v-btn flat>Admin</v-btn>
        <v-btn flat>Logout</v-btn>
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
