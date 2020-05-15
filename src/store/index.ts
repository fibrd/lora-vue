import Vue from 'vue'
import Vuex from 'vuex'

// state
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations: {
        SET_VILLAINS_NAMES(state, names) {
            state.villainsNames = names
        },
        UPDATE_SCORE(state, score) {
            state.score = score
        },
        NEXT_GAME(state) {
            state.mode++
        }
    },
    actions: {
        setVillainsNames({ commit }, names) {
            commit('SET_VILLAINS_NAMES', names)
        },
        updateScore({ state, commit }, score) {
            const updatedScore = state.score.map(
                (points, index) => points + score[index]
            )
            commit('UPDATE_SCORE', updatedScore)
        },
        nextGame({ commit }) {
            commit('NEXT_GAME')
        }
    }
})
