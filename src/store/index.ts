import Vue from 'vue'
import Vuex from 'vuex'

// state
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations: {
        SET_PLAYER_NAME(state, name) {
            state.playerName = name
        },
        SET_VILLAINS_NAMES(state, names) {
            state.villainsNames = names
        },
        SET_TIME_OUT(state, timeOut) {
            state.timeOut = timeOut
        },
        UPDATE_SCORE(state, score) {
            state.score = score
        },
        NEXT_GAME(state) {
            state.mode++
        },
        SET_GAME(state, mode) {
            state.mode = mode
        },
        TURN_ON_EXAM(state) {
            state.examination = true
        },
        TURN_OFF_EXAM(state) {
            state.examination = false
        }
    },
    actions: {
        setVillainsNames({ commit }, names) {
            commit('SET_VILLAINS_NAMES', names)
        },
        setPlayerName({ commit }, name) {
            commit('SET_PLAYER_NAME', name)
        },
        setTimeOut({ commit }, timeOut) {
            commit('SET_TIME_OUT', timeOut)
        },
        updateScore({ state, commit }, score) {
            const updatedScore = state.score.map(
                (points, index) => points + score[index]
            )
            commit('UPDATE_SCORE', updatedScore)
        },
        nextGame({ commit }) {
            commit('NEXT_GAME')
        },
        setGame({ commit }, mode) {
            commit('SET_GAME', +mode)
        },
        turnOnExam({ commit }) {
            commit('TURN_ON_EXAM')
        },
        turnOffExam({ commit }) {
            commit('TURN_OFF_EXAM')
        }
    }
})
