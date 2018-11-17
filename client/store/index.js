import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      scores: null,
      loading: false
    },
    mutations: {
      setScores(state, scores) {
        state.scores = scores
      },
      setLoading(state, value) {
        state.loading = value
      }
    },
    actions: {
      async getScores({ commit }) {
        let scores = await this.$axios.$get('/scores/teacher')
        commit('setScores', scores)
      }
    },
    getters: {
      scores(state) {
        return state.scores
      },
      loading(state) {
        return state.loading
      }
    }
  })
}

export default createStore
