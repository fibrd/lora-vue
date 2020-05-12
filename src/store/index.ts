import Vue from 'vue'
import Vuex from 'vuex'

// state
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations: {
        UPDATE_SCORE(state, score) {
            state.score = score
        }
    },
    actions: {
        updateScore({ state, commit }, score) {
            const updatedScore = state.score.map(
                (points, index) => points + score[index]
            )
            commit('UPDATE_SCORE', updatedScore)
        }
    }
})
