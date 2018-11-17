import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false
    },
    mutations: {
      setLoading(state, value) {
        state.loading = value
      }
    },
    actions: {},
    getters: {
      loading(state) {
        return state.loading
      }
    }
  })
}

export default createStore
