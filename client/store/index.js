import Vuex from 'vuex'
const cookieparser = process.server ? require('cookieparser') : undefined

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      auth: null
    },
    mutations: {
      setLoading(state, value) {
        state.loading = value
      },
      setAuth(state, value) {
        state.auth = value
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
      }
    }
  })
}

export default createStore
