import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      auth: false
    },
    mutations: {
      setLoading(state, value) {
        state.loading = value
      },
      setAuth(state, value) {
        state.auth = value
      }
    },
    actions: {},
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
