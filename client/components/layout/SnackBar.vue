<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="timeout"
    :bottom="bottom"
  >
    {{ snackbarMessage }}
    <v-btn color="black" flat @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      timeout: 3000,
      bottom: true
    }
  },
  computed: {
    snackbar: {
      get() {
        return this.$store.getters.snackbar
      },
      set() {
        this.$store.commit('closeSnackBar')
      }
    },
    snackbarMessage() {
      return this.$store.getters.snackbarMessage
    },
    snackbarColor() {
      return this.$store.getters.snackbarColor
    }
  }
}
</script>
