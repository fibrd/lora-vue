<template>
    <div id="app">
        <h1 class="current-game">{{ gameMode }}</h1>
        <table-score :currentScore="currentScore" />
        <div class="villains-container">
            <villain-deck
                v-for="index in 3"
                :key="index"
                :highlighted="initPlayer === index - 1"
                :villainCards="playersCards[index - 1]"
                :villain="index - 1"
            />
        </div>
        <exam-select v-if="mode === 7" />
        <board-card
            v-if="!isTens"
            :currentLoser="currentLoser"
            :boardCards="boardCards"
            :initPlayer="initPlayer"
        />
        <tens-board v-else :playedCards="alreadyPlayedCards" />
        <hero-deck
            :heroCards="playersCards[3]"
            @cardTurned="heroTurn($event)"
            @giveUp="giveUp"
        />
        <div class="button-container">
            <button v-on:click="giveUp" v-show="!isTens">Zahodit karty</button>
            <button v-on:click="tensNext" v-show="isTens && tensPlayed">
                Další hráč
            </button>
            <button v-on:click="tensKnock(3)" v-show="isTens && !tensPlayed">
                Ťuk
            </button>
        </div>

        <div id="nav">
            <router-link to="/">Home</router-link> |
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
import { mapState } from 'vuex'

// components
import HeroDeck from '@/components/HeroDeck.vue'
import VillainDeck from '@/components/VillainDeck.vue'
import BoardCard from '@/components/BoardCard.vue'
import TensBoard from '@/components/TensBoard.vue'
import TableScore from '@/components/TableScore.vue'
import ExamSelect from '@/components/ExamSelect.vue'

// lodash helpers
import { shuffle, chunk, sortBy, takeRight, slice } from 'lodash-es'

export default Vue.extend({
    components: {
        HeroDeck,
        VillainDeck,
        BoardCard,
        TensBoard,
        TableScore,
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
            'initThaliaPlayer'
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

            if (this.mode !== 6) {
                //setting up the new init card
                this.initCard = this.boardCards[0]
                // opponents make their reaction turns
                this.allVillainsReact(this.boardCards.length)

                // appointing loser of the current game
                this.currentLoser = this.appointLoser()

                this.calculatePoints()

                this.timer = setTimeout(() => {
                    // setting up the new init player
                    this.initPlayer = this.currentLoser
                    this.currentLoser = -1

                    // resets data after timeout
                    this.heroCanAct = true
                    this.boardCards = []

                    // initializes opponents turn only if hero has cards
                    // or the score already reached its top
                    if (
                        this.playersCards[3].length &&
                        this.currentScore.reduce(
                            (score, sum) => sum + score
                        ) !== 8
                    ) {
                        this.allVillainsInit()
                    } else {
                        this.nextGame()
                    }
                }, this.timeOut)
            } else {
                this.tensOverCheck()
                this.tensPlayed = true
            }
        },
        validateCard(card: Card): boolean {
            // checks if hero is turning the valid flush
            // w/ exception for game mode tens & quarters
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
                this.villainTurn(villainsCount - 1 - i)
            }
        },
        allVillainsReact(boardLen: number): void {
            const maxBoardLen = 4
            // calculates villains count to act
            const villainsToAct = maxBoardLen - boardLen

            // setting rest of opponents to make their reactions
            for (let i = 0; i < villainsToAct; i++) {
                this.villainTurn(i)
            }
        },
        villainTurn(villain: number): void {
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
                    currentCards = quarters.villainTurn(
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
            for (let i = 0; i < 3; i++) {
                this.villainTurn(i)
                this.tensOverCheck()
            }
            this.tensPlayed = false
        },
        tensOverCheck(): void {
            if (tens.isOver(this.playersCards)) {
                this.calculatePoints()
                this.heroCanAct = false

                this.nextGame()
                this.heroCanAct = true
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
        giveUp(): void {
            if (window.confirm('Chcete hru dobrovolně vzdát?')) {
                this.currentScore[3] =
                    8 - this.currentScore.reduce((score, sum) => sum + score)

                this.boardCards = []
                this.heroCanAct = true
                window.clearTimeout(this.timer)
                this.nextGame()
            }
        },
        nextGame(): void {
            if (this.examination) {
                if (this.currentScore[this.initThaliaPlayer] > 0) {
                    this.$store.dispatch('setGame', 7)
                    this.currentScore.fill(0)
                    this.currentScore[this.initThaliaPlayer] = 8
                } else {
                    this.$store.dispatch('setGame', 0)
                    this.$store.dispatch('turnOffExam')
                }
            } else {
                this.$store.dispatch('nextGame')
            }
            this.$store.dispatch('updateScore', this.currentScore)
            this.currentScore = [0, 0, 0, 0]
            this.initPlayer = this.initThaliaPlayer
            this.alreadyPlayedCards = []
            this.initCard = {} as Card
            this.initCards()
        }
    },
    watch: {
        boardCards(cards: Card[]) {
            if (cards.length > 0)
                cards.forEach(c => this.alreadyPlayedCards.push(c))
        },
        mode(value: number) {
            if (value === 7) {
                this.$store.dispatch('turnOnExam')
                this.boardCards = []
            }
        }
    },
    created() {
        this.initCards()
        this.allVillainsInit()
        this.$store.dispatch('setVillainsNames', general.randomNames())
    }
})
</script>

<style src="@/assets/main.scss" lang="scss"></style>
