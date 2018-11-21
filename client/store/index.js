import Vuex from 'vuex'
const cookieparser = process.server ? require('cookieparser') : undefined

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      auth: null,
      navDrawer: false
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
      }
    },
    getters: {
      loading(state) {
        return state.loading
      },
      auth(state) {
        return state.auth
      },
      navDrawer(state) {
        return state.navDrawer
      }
    }
  })
}

export default createStore
