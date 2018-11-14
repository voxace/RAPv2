import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      scores: {}
    },
    mutations: {
      setScores(state, scores) {
        state.scores = scores
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
      }
    }
  })
}

export default createStore
