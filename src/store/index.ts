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
            state.totalScore = score
        },
        NEXT_GAME_MODE(state) {
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
        },
        SET_EXAM_ATTEMPT(state, attempt) {
            state.examAttempt = attempt
        },
        SET_THALIA(state, thalia) {
            state.thalia = thalia
        },
        SET_GAME_OVER(state) {
            state.gameIsOver = true
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
            const totalScoreLen = state.totalScore.length
            const updatedScore =
                totalScoreLen > 0
                    ? state.totalScore[totalScoreLen - 1].map(
                          (points, index) => points + score[index]
                      )
                    : score
            commit('UPDATE_SCORE', [...state.totalScore, updatedScore])
        },
        nextGameMode({ commit }) {
            commit('NEXT_GAME_MODE')
        },
        setGame({ commit }, mode) {
            commit('SET_GAME', +mode)
        },
        turnOnExam({ commit }) {
            commit('TURN_ON_EXAM')
        },
        turnOffExam({ commit }) {
            commit('TURN_OFF_EXAM')
            commit('SET_EXAM_ATTEMPT', 0)
        },
        setThalia({ commit }, thalia) {
            commit('SET_THALIA', +thalia)
        },
        setGameOver({ commit }) {
            commit('SET_GAME_OVER')
        },
        setExamAttempt({ commit }, attempt) {
            commit('SET_EXAM_ATTEMPT', +attempt)
        },

    }
})
