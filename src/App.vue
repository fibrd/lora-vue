<template>
    <div id="app">
        <div v-if="!gameIsOver" class="game-container">
            <div class="page-heading">
                <h3 class="current-game">
                    <span v-show="examination">Maturita: </span>
                    {{ gameMode }}
                    ({{ thalia + 1 }}. tálie)
                </h3>
            </div>
            <div class="villains-container">
                <villain-deck
                    v-for="index in 3"
                    :key="index"
                    :highlighted="initPlayer === index - 1"
                    :villainCards="playersCards[index - 1]"
                    :villain="index - 1"
                    :currentScore="currentScore"
                />
            </div>
            <exam-select
                v-if="mode === 7"
                :examAttempt="examAttempt"
                @examPicked="examPicked($event)"
            />
            <board-card
                v-if="!isTens"
                :currentLoser="currentLoser"
                :boardCards="boardCards"
                :initPlayer="initPlayer"
            />
            <tens-board v-else :playedCards="alreadyPlayedCards" />
            <hero-deck
                :heroCards="playersCards[3]"
                :currentScore="currentScore[3]"
                @cardTurned="heroTurn($event)"
                @giveUp="giveUp"
            />
            <div class="button-container">
                <a
                    href=""
                    @click.prevent="giveUp"
                    v-show="!isTens && !isQuarters && mode !== 7"
                >
                    Zahodit karty
                </a>
                <a
                    href=""
                    @click.prevent="tensNext"
                    v-show="isTens && tensPlayed"
                >
                    Další hráč
                </a>
                <a
                    href=""
                    @click.prevent="tensKnock(3)"
                    v-show="isTens && !tensPlayed"
                >
                    Ťuk
                </a>
            </div>
        </div>
        <div id="nav">
            <router-link to="/">Výsledky</router-link> |
            <router-link to="/settings">Nastavení</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import {
    general,
    hearts,
    queens,
    fila,
    any,
    king,
    quarters,
    tens
} from '@/modes/'
import { mapState, mapActions } from 'vuex'

// components
import HeroDeck from '@/components/HeroDeck.vue'
import VillainDeck from '@/components/VillainDeck.vue'
import BoardCard from '@/components/BoardCard.vue'
import TensBoard from '@/components/TensBoard.vue'
import ExamSelect from '@/components/ExamSelect.vue'

// lodash helpers
import { shuffle, chunk, sortBy, takeRight, slice } from 'lodash-es'

export default Vue.extend({
    components: {
        HeroDeck,
        VillainDeck,
        BoardCard,
        TensBoard,
        ExamSelect
    },
    data() {
        return {
            boardCards: [] as Card[],
            playersCards: [] as Card[][],
            alreadyPlayedCards: [] as Card[],
            heroCanAct: true,
            currentScore: [0, 0, 0, 0],
            initPlayer: 3,
            currentLoser: -1,
            initCard: {} as Card,
            tensPlayed: false,
            timer: 0
        }
    },
    computed: {
        ...mapState([
            'cards',
            'mode',
            'timeOut',
            'examination',
            'thalia',
            'gameIsOver',
            'examAttempt'
        ]),
        gameMode() {
            return general.gameMode()
        },
        isTens() {
            return this.mode === 6
        },
        isQuarters() {
            return this.mode === 5
        }
    },
    methods: {
        ...mapActions([
            'setVillainsNames',
            'updateScore',
            'turnOnExam',
            'turnOffExam',
            'nextGameMode',
            'setGame',
            'setThalia',
            'setGameOver',
            'setExamAttempt'
        ]),
        shuffleDeck(): Card[] {
            return shuffle(this.cards)
        },
        chunkDeck(): Card[][] {
            return chunk(this.shuffleDeck(), 8)
        },
        initCards(): void {
            const chunkedDeck = this.chunkDeck()
            this.playersCards = [
                [...chunkedDeck[0]],
                [...chunkedDeck[1]],
                [...chunkedDeck[2]],
                [...chunkedDeck[3]]
            ]
        },
        heroTurn(card: Card) {
            // reaction timeout is set up
            if (!this.heroCanAct && !this.isTens) return
            if (this.mode > 6) return
            if (!this.validateCard(card)) return

            this.heroCanAct = false

            // deletes selected card out of hero's deck
            this.playersCards[3] = this.playersCards[3].filter(c => c !== card)

            // adding selected card to the board
            this.boardCards = [...this.boardCards, card]

            // every mode except the tens
            if (this.mode < 6) {
                //setting up the new init card
                this.initCard = this.boardCards[0]
                // opponents make their reaction turns
                if (this.mode < 5) {
                    this.allVillainsReact(this.boardCards.length)
                    // appointing loser of the current game
                    this.currentLoser = this.appointLoser()

                    this.calculatePoints()
                    this.nextTurn()
                    // quarters
                } else {
                    this.quartersNext()
                }
            } else {
                this.noCardsCheck()
                this.tensPlayed = true
            }
        },
        validateCard(card: Card): boolean {
            // checks if hero is turning the valid flush
            // w/ exception for game mode tens
            if (
                this.initPlayer !== 3 &&
                !this.isFlushValid(card) &&
                !this.isTens
            ) {
                return false
            }

            switch (this.mode) {
                // hearts
                case 0:
                    if (
                        this.initPlayer === 3 &&
                        !hearts.canInitHeart(card, this.playersCards[3])
                    )
                        return false
                    break
                case 4:
                    if (
                        this.initPlayer === 3 &&
                        !king.canInitHeart(card, this.playersCards[3])
                    )
                        return false
                    break
                case 5:
                    if (
                        this.initPlayer !== 3 &&
                        !quarters.canPlayCard(card, this.initCard)
                    )
                        return false
                    break
                case 6:
                    if (!tens.canPlayCard(card, this.alreadyPlayedCards))
                        return false
                    break
            }
            return true
        },
        isFlushValid(card: Card): boolean {
            // finds any hero's card with flush equals to the initializing one
            const anyFlushCard = this.playersCards[3].find(
                c => c.flush === this.initCard.flush
            )
            return (
                card.flush === this.initCard.flush || anyFlushCard === undefined
            )
        },
        allVillainsInit(): void {
            const villainsCount = 3
            // calculates villains count to act
            const villainsToAct = villainsCount - this.initPlayer

            // setting initializing opponents to make their moves
            for (let i = 0; i < villainsToAct; i++) {
                const marginIndex = (i + this.initPlayer) % 4
                this.villainTurn(marginIndex)
            }
        },
        allVillainsReact(boardLen: number): void {
            const maxBoardLen = 4
            // calculates villains count to act (max 3)
            const villainsToAct = maxBoardLen - boardLen

            // setting rest of opponents to make their reactions
            for (let i = 0; i < villainsToAct; i++) {
                this.villainTurn(i)
            }
        },
        villainTurn(villain: number): void {
            console.log(villain)
            const playerCards = this.playersCards[villain]
            const sortedDeck = sortBy(playerCards, ['value'])

            // current turn is initializing
            if (this.boardCards.length === 0 && !this.isTens) {
                let currentCard = {} as Card
                switch (this.mode) {
                    case 0:
                        currentCard = hearts.villainInitCard(sortedDeck)
                        break
                    case 1:
                        currentCard = queens.villainInitCard(sortedDeck)
                        break
                    case 4:
                        currentCard = king.villainInitCard(sortedDeck)
                        break

                    default:
                        currentCard = any.villainInitCard(sortedDeck)
                        break
                }
                this.initCard = currentCard
                this.boardCards = [currentCard]
                this.playersCards[villain] = playerCards.filter(
                    c => c !== currentCard
                )
                return
            }

            // filtering players cards w/ the same flush
            const eligeableCards = playerCards.filter(
                c => c.flush === this.initCard.flush
            ) as Card[]

            this.currentLoser =
                this.currentLoser >= 0 ? this.currentLoser : this.initPlayer
            let currentCards = [] as Card[]
            switch (this.mode) {
                case 0:
                    currentCards = hearts.villainReactCard(
                        playerCards,
                        eligeableCards,
                        this.initCard
                    )
                    break
                case 1:
                    currentCards = queens.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break
                case 4:
                    currentCards = king.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break
                case 5:
                    currentCards = quarters.villainReactCards(
                        playerCards,
                        this.initCard
                    )
                    break
                case 6:
                    currentCards = tens.villainTurn(
                        playerCards,
                        this.alreadyPlayedCards
                    )
                    break

                default:
                    currentCards = any.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break
            }

            const currentMaxValue = Math.max(...currentCards.map(c => c.value))
            const boardMaxValue = Math.max(...this.boardCards.map(c => c.value))
            if (currentMaxValue > boardMaxValue && eligeableCards.length) {
                this.currentLoser = villain
                console.log('appointing')
            }

            // immutable array push
            if (currentCards.length) {
                this.boardCards = [...this.boardCards, ...currentCards]
                this.playersCards[villain] = playerCards.filter(
                    c => !currentCards.includes(c)
                )
            } else if (this.isTens) {
                this.tensKnock(villain)
            }
        },
        nextTurn(): void {
            this.timer = setTimeout(() => {
                // setting up the new init player
                this.initPlayer = this.currentLoser

                // resets data after timeout
                this.heroCanAct = true
                this.boardCards = []

                // initializes opponents turn only if hero has cards
                // or the score already reached its top
                if (
                    this.playersCards[3].length &&
                    this.currentScore.reduce((score, sum) => sum + score) !== 8
                ) {
                    console.log(this.initPlayer)
                    if (!this.isQuarters) this.allVillainsInit()
                    else if (this.initPlayer !== 3) {
                        this.quartersNext()
                    }
                } else {
                    this.nextGame()
                }
            }, this.timeOut)
        },
        appointLoser(): number {
            let currentLoser = this.initPlayer

            // resorting actual board according to the initial player
            const sortedBoard = slice(
                [
                    ...takeRight(this.boardCards, this.initPlayer),
                    ...this.boardCards
                ],
                0,
                4
            )

            // appointing the new current loser only if player's card
            // is eligeable (the same flush w/ bigger value)
            sortedBoard.forEach((card, index) => {
                const loserCard = sortedBoard[currentLoser]
                if (
                    card.flush === loserCard.flush &&
                    card.value > loserCard.value
                )
                    currentLoser = index
            })
            return currentLoser
        },
        calculatePoints(): void {
            let score = []
            switch (this.mode) {
                case 0:
                    score = hearts.score(this.boardCards, this.currentLoser)
                    break
                case 1:
                    score = queens.score(this.boardCards, this.currentLoser)
                    break
                case 2:
                    score = fila.score(
                        this.playersCards[3].length,
                        this.currentLoser
                    )
                    break
                case 4:
                    score = king.score(this.boardCards, this.currentLoser)
                    break
                case 5:
                    score = tens.score(this.playersCards)
                    break
                case 6:
                    score = tens.score(this.playersCards)
                    break

                default:
                    score = any.score(this.boardCards, this.currentLoser)
                    break
            }
            this.currentScore = score.map(
                (pts, index) => pts + this.currentScore[index]
            )
        },
        tensNext(): void {
            this.allVillainsReact(1)
            this.noCardsCheck() // TO CHECK
            this.tensPlayed = false
        },
        noCardsCheck(): void {
            if (tens.isOver(this.playersCards)) {
                this.calculatePoints()
                this.heroCanAct = false

                setTimeout(() => {
                    this.nextGame()
                    this.heroCanAct = true
                }, this.timeOut)
            }
        },
        tensKnock(player: number): void {
            if (
                tens.noEligeableCard(
                    this.playersCards[player],
                    this.alreadyPlayedCards
                )
            ) {
                this.currentScore = this.currentScore.map((pts, index) =>
                    index === player ? ++pts : pts
                )
                if (player === 3) this.tensNext()
            } else {
                alert('Pozor na renonc!')
            }
        },
        quartersNext(): void {
            this.noCardsCheck()
            for (let i = 0; i < 4; i++) {
                this.villainTurn(i)
                this.noCardsCheck()
            }

            this.nextTurn()
        },
        giveUp(): void {
            if (window.confirm('Chcete hru dobrovolně vzdát?')) {
                this.currentScore[3] =
                    this.currentScore[3] +
                    8 -
                    this.currentScore.reduce((score, sum) => sum + score)

                this.nextGame()
            }
        },
        // eslint-disable-next-line
        examPicked(event: any) {
            this.setGame(event.target.value)
        },
        examinate(): void {
            // examination failed
            if (this.currentScore[this.thalia] > 0) {
                this.currentScore.fill(0)
                this.currentScore[this.thalia] = 8
                this.updateScore(this.currentScore)
                if (this.examAttempt < 3) this.setGame(7)
                else this.nextThalia()
            } else {
                // examination passed
                this.nextThalia()
            }
        },
        nextThalia(): void {
            if (this.thalia === 3) this.gameOver()
            this.setGame(0)
            this.setThalia(this.thalia + 1)
            if (this.examAttempt < 3) {
                // if examination is done earlier it fills the vacant fields
                this.updateScore(this.currentScore)
                for (let i = 0; i <= 2 - this.examAttempt; i++) {
                    this.updateScore([0, 0, 0, 0])
                }
            }
            this.turnOffExam()
        },
        nextGame(): void {
            if (!this.examination) {
                this.updateScore(this.currentScore)
                this.nextGameMode()
            } else {
                this.examinate()
            }

            this.resetGameStats()
            this.initCards()
            if (!this.isQuarters) this.allVillainsInit()
            else this.quartersNext()
        },
        resetGameStats(): void {
            window.clearTimeout(this.timer)
            this.currentScore = [0, 0, 0, 0]
            this.initPlayer = this.thalia
            this.alreadyPlayedCards = []
            this.initCard = {} as Card
            this.boardCards = []
            this.heroCanAct = true
        },
        gameOver(): void {
            window.alert('Game is over!')
            this.setGameOver()
        }
    },
    watch: {
        boardCards(cards: Card[]) {
            if (cards.length > 0)
                cards.forEach(c => this.alreadyPlayedCards.push(c))
        },
        mode(value: number) {
            if (value === 7) {
                this.setExamAttempt(this.examAttempt + 1)

                this.turnOnExam()
                this.resetGameStats()
                if (this.initPlayer !== 3) {
                    this.setGame(4)
                    this.allVillainsInit()
                }
            }
        }
    },
    created() {
        this.setVillainsNames(general.randomNames())
        this.resetGameStats()
        this.initCards()
        this.allVillainsInit()
    }
})
</script>

<style src="@/assets/main.scss" lang="scss"></style>
