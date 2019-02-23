import Vuex from 'vuex'
const cookieparser = process.server ? require('cookieparser') : undefined

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      auth: null,
      navDrawer: false,
      snackbar: false,
      snackbarColor: 'success',
      snackbarMessage: 'Message'
    },
    mutations: {
      setLoading(state, value) {
        state.loading = value
      },
      setAuth(state, value) {
        state.auth = value
      },
      setNavDrawer(state, value) {
        state.navDrawer = value
      },
      toggleNavDrawer(state) {
        state.navDrawer = !state.navDrawer
      },
      openSuccessBar(state, message) {
        state.snackbar = true
        state.snackbarColor = 'success'
        state.snackbarMessage = message
      },
      openErrorBar(state, message) {
        state.snackbar = true
        state.snackbarColor = 'error'
        state.snackbarMessage = message
      },
      closeSnackBar(state) {
        state.snackbar = false
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        let auth = null
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          try {
            auth = JSON.parse(parsed.auth)
          } catch (err) {
            // No valid cookie found
          }
        }
        commit('setAuth', auth)
      },
      openSuccessBar(context, message) {
        context.commit('openSuccessBar', message)
      },
      openErrorBar(context, message) {
        context.commit('openErrorBar', message)
      },
      closeSnackBar(context) {
        context.commit('closeSnackBar')
      }
    },
    getters: {
      loading: state => state.loading,
      auth: state => state.auth,
      navDrawer: state => state.navDrawer,
      snackbar: state => state.snackbar,
      snackbarColor: state => state.snackbarColor,
      snackbarMessage: state => state.snackbarMessage
    }
  })
}

export default createStore
