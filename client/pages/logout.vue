<template>
  <v-layout
    v-show="visible"
    align-center
    justify-center>
    Logging out...
  </v-layout>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  created() {
    this.logout()
  },
  methods: {
    logout() {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.push('/')
    }
  }
}
</script>
