<template>
  <v-layout v-show="visible" align-center justify-center>
    <v-flex xs12 sm8 md4 mb-5 pb-5>
      <v-card class="elevation-12" mb-5 pb-5>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" color="indigo">
            <v-text-field
              :rules="usernameRules"
              v-model="username"
              autofocus
              prepend-icon="person"
              name="username"
              label="DET Username"
              type="text"
              @keyup.enter="Login"
            />
            <v-text-field
              id="password"
              v-model="password"
              :rules="passwordRules"
              prepend-icon="lock"
              name="password"
              label="Password"
              type="password"
              @keyup.enter="Login"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!valid"
            :loading="loading"
            class="white--text mr-2 mb-2"
            color="primary"
            @click="Login"
          >
            Login
          </v-btn>
        </v-card-actions>
        <v-snackbar v-model="snackbar" :timeout="timeout" color="error" bottom>
          Invalid username or password
        </v-snackbar>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      valid: false,
      username: '',
      loading: false,
      visible: true,
      usernameRules: [v => !!v || 'Username is required'],
      password: '',
      passwordRules: [v => !!v || 'Password is required'],
      timeout: 6000,
      snackbar: false
    }
  },
  middleware: 'login',
  methods: {
    async Login() {
      if (this.valid) {
        this.loading = true
        this.Scores = await this.$axios
          .$post('/auth/login', {
            username: this.username,
            password: this.password
          })
          .then(response => {
            this.$store.commit('setAuth', response)
            Cookie.set('auth', response)
            this.visible = false
            this.$router.push('/')
            this.loading = false
          })
          .catch(error => {
            console.log(error)
            this.snackbar = true
            this.loading = false
          })
      }
    }
  }
}
</script>
