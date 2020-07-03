import Vue from 'vue'
import Vuex from 'vuex'

// state
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations: {
        SET_PLAYERS_CARDS(state, cards) {
            state.playersCards = []
            state.playersCards = cards
        },
        SET_ALREADY_PLAYED_CARDS(state, cards) {
            state.alreadyPlayedCards = cards
        },
        SET_HERO_CAN_ACT(state, bool) {
            state.heroCanAct = bool
        },
        SET_BOARD_CARDS(state, cards) {
            state.boardCards = cards
        },
        SET_INIT_CARD(state, card) {
            state.initCard = card
        },
        SET_INIT_PLAYER(state, player) {
            state.initPlayer = player
        },
        SET_CURRENT_LOSER(state, loser) {
            state.currentLoser = loser
        },
        SET_CURRENT_SCORE(state, score) {
            state.currentScore = score
        },
        SET_TENS_PLAYED(state, bool) {
            state.tensPlayed = bool
        },
        SET_IS_FINISHED(state, bool) {
            state.isFinished = bool
        },

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
        },
        SET_SORTING_CARDS(state, bool) {
            state.sortingCards = bool
        },
        SUBMIT_RECORD(state) {
            state.recordSubmitted = true
        },
        SET_RECORDS(state, records) {
            state.records = records
        },
        SET_RECORDS_DAILY(state, recordsDaily) {
            state.recordsDaily = recordsDaily
        },
        SET_RECORDS_WEEKLY(state, recordsWeekly) {
            state.recordsWeekly = recordsWeekly
        },
        SET_RECORDS_MONTHLY(state, recordsMonthly) {
            state.recordsMonthly = recordsMonthly
        },
        SET_LEVEL(state, level) {
            state.level = level
        },
        START_GAME(state) {
            state.started = true
        }
    },
    actions: {
        setPlayersCards({ commit }, cards) {
            commit('SET_PLAYERS_CARDS', cards)
        },
        setAlreadyPlayedCards({ commit }, cards) {
            commit('SET_ALREADY_PLAYED_CARDS', cards)
        },
        setHeroCanAct({ commit }, bool) {
            commit('SET_HERO_CAN_ACT', bool)
        },
        setBoardCards({ state, commit }, cards) {
            commit('SET_BOARD_CARDS', cards)
            if (!cards.length) return
            if (state.mode !== 6)
                commit('SET_ALREADY_PLAYED_CARDS', [
                    ...state.alreadyPlayedCards,
                    cards[cards.length - 1]
                ])
            else
                commit('SET_ALREADY_PLAYED_CARDS', [
                    ...state.alreadyPlayedCards,
                    ...cards
                ])
        },
        setInitCard({ commit }, card) {
            commit('SET_INIT_CARD', card)
        },
        setInitPlayer({ commit }, player) {
            commit('SET_INIT_PLAYER', player)
        },
        setCurrentLoser({ commit }, loser) {
            commit('SET_CURRENT_LOSER', loser)
        },
        setCurrentScore({ commit }, score) {
            commit('SET_CURRENT_SCORE', score)
        },
        setTensPlayed({ commit }, bool) {
            commit('SET_TENS_PLAYED', bool)
        },
        setIsFinished({ commit }, bool) {
            commit('SET_IS_FINISHED', bool)
        },
        setVillainsNames({ commit }, names) {
            commit('SET_VILLAINS_NAMES', names)
        },
        setPlayerName({ commit }, name) {
            commit('SET_PLAYER_NAME', name)
        },
        setTimeOut({ commit }, timeOut) {
            commit('SET_TIME_OUT', timeOut)
        },
        updateScore({ state, commit }, { score, gameMode }) {
            const totalScoreLen = state.totalScore.length
            const updatedScore =
                totalScoreLen > 0
                    ? {
                          mode: gameMode,
                          score: state.totalScore[totalScoreLen - 1].score.map(
                              (points: number, index: number) =>
                                  points + score[index]
                          )
                      }
                    : { mode: gameMode, score: score }
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
        setSortingCards({ commit }, bool) {
            commit('SET_SORTING_CARDS', bool)
        },
        submitRecord({ commit }) {
            commit('SUBMIT_RECORD')
        },
        setRecords({ commit }, records) {
            commit('SET_RECORDS', records)
        },
        setRecordsDaily({ commit }, recordsDaily) {
            commit('SET_RECORDS_DAILY', recordsDaily)
        },
        setRecordsWeekly({ commit }, recordsWeekly) {
            commit('SET_RECORDS_WEEKLY', recordsWeekly)
        },
        setRecordsMonthly({ commit }, recordsMonthly) {
            commit('SET_RECORDS_MONTHLY', recordsMonthly)
        },
        setLevel({ commit }, level) {
            commit('SET_LEVEL', level)
        },
        startGame({ commit }) {
            commit('START_GAME')
        }
    }
})
