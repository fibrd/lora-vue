<template>
    <div id="app">
        <div v-if="!gameIsOver" class="game-container">
            <div class="page-heading">
                <h3 class="current-game">
                    <span v-show="examination">Maturita: </span>
                    {{ gameMode }} / {{ thalia + 1 }}. tálie
                </h3>
            </div>
            <div class="villains-container">
                <deck-villain
                    v-for="index in 3"
                    :key="index"
                    :highlighted="initPlayer === index - 1"
                    :villainCards="playersCards[index - 1]"
                    :villain="index - 1"
                    :currentScore="currentScore"
                />
            </div>
            <exam-select v-if="mode === 7" @examPicked="examPicked($event)" />
            <board-cards
                v-if="!isTens"
                :currentLoser="currentLoser"
                :boardCards="boardCards"
                :initPlayer="initPlayer"
            />
            <board-cards-tens v-else :alreadyPlayedCards="alreadyPlayedCards" />
            <deck-hero
                :heroCards="playersCards[3]"
                :currentScore="currentScore[3]"
                @cardTurned="heroTurn($event)"
            />
            <div class="button-container" v-show="heroCanAct">
                <a href="" @click.prevent="giveUp" v-show="mode < 5">
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
import { mapState, mapActions } from 'vuex'
import { Card } from '@/types'

// module methods & properties specific for each game mode
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

// components
import BoardCards from '@/components/BoardCards.vue'
import BoardCardsTens from '@/components/BoardCardsTens.vue'
import DeckHero from '@/components/DeckHero.vue'
import DeckVillain from '@/components/DeckVillain.vue'
import ExamSelect from '@/components/ExamSelect.vue'

// lodash helpers
import { shuffle, chunk, sortBy } from 'lodash-es'

export default Vue.extend({
    components: {
        DeckHero,
        DeckVillain,
        BoardCards,
        BoardCardsTens,
        ExamSelect
    },
    data() {
        return {
            alreadyPlayedCards: [] as Card[],
            boardCards: [] as Card[],
            playersCards: [] as Card[][],
            initCard: {} as Card,
            initPlayer: 0,
            heroCanAct: true,
            currentScore: [0, 0, 0, 0],
            currentLoser: -1,
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
        isQuarters() {
            return this.mode === 5
        },
        isTens() {
            return this.mode === 6
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
        // shuffles the initial sorted deck
        getShuffledDeck(): Card[] {
            return shuffle(this.cards)
        },
        // divides the shuffled deck into the four decks of eight cards
        getChunkedDeck(): Card[][] {
            return chunk(this.getShuffledDeck(), 8)
        },
        // shuffles up & deals
        initCards(): void {
            const chunkedDeck = this.getChunkedDeck()
            this.playersCards = [
                [...chunkedDeck[0]],
                [...chunkedDeck[1]],
                [...chunkedDeck[2]],
                [...chunkedDeck[3]]
            ]
        },
        // called after the hero makes any move
        heroTurn(card: Card) {
            // checks if the hero is allowed to act
            if (!this.heroCanAct) return

            // not allowed while choosing an exam mode
            if (this.mode === 7) return

            // validate this card specifically for each game mode
            if (!this.isCardValid(card)) return

            // disables hero moves for a moment
            this.heroCanAct = false

            // deletes selected card out of hero's deck
            this.playersCards[3] = this.playersCards[3].filter(c => c !== card)

            // adding selected card to the board
            this.boardCards = [...this.boardCards, card]

            // all the modes except for tens
            if (this.mode < 6) {
                //setting up the new init card
                this.initCard = this.boardCards[0]
                // all the modes except for tens and quarters
                if (this.mode < 5) {
                    // opponents make their reaction turns
                    this.allVillainsReact(this.boardCards.length)
                    // appointing loser of the current game
                    if (card.flush === this.initCard.flush) {
                        this.currentLoser = this.isLoser(card.value)
                            ? 3
                            : this.currentLoser
                    }

                    // recalculates current state of score
                    this.calculatePoints()

                    // serves a new set of cards after some timeout
                    this.nextTurn()
                } else {
                    // quarters
                    this.quartersNext()
                }
            } else {
                // tens
                this.tensMoved()
            }
        },
        isCardValid(card: Card): boolean {
            // declines when hero is reacting and his card does not have valid flush
            // w/ exception for game mode tens
            if (
                this.initPlayer !== 3 &&
                !general.isFlushValid(
                    card,
                    this.playersCards[3],
                    this.initCard
                ) &&
                !this.isTens
            )
                return false

            // different rules for every single game mode
            // details in modes/index.ts
            switch (this.mode) {
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
                        this.playersCards[3].length === 8 &&
                        !quarters.canInitCard(card, this.playersCards[3])
                    )
                        return false
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
        allVillainsInit(): void {
            const villainsCount = 3
            // calculates villains count to act
            const villainsToAct = villainsCount - this.initPlayer

            // forces opponents to make their initializing moves
            for (let i = 0; i < villainsToAct; i++) {
                // editting their order based on the initilizing player
                const marginIndex = (i + this.initPlayer) % 4
                this.villainTurn(marginIndex)
            }
            this.heroCanAct = true
            if (this.isQuarters && this.currentLoser !== 3) this.quartersNext()
        },
        allVillainsReact(boardLen: number): void {
            const maxBoardLen = 4
            // calculates villains count to act (min boardlen is 1 here)
            const villainsToAct = maxBoardLen - boardLen

            // sets up the opponents to make their reactions
            for (let i = 0; i < villainsToAct; i++) {
                this.villainTurn(i)
            }
        },
        villainTurn(villain: number): void {
            // defines & sorts the player's cards
            const playerCards = this.playersCards[villain]
            const sortedDeck = sortBy(playerCards, ['value'])

            // this turn is initializing
            if (this.boardCards.length === 0 && !this.isTens) {
                let currentCard = {} as Card
                switch (this.mode) {
                    case 0:
                        currentCard = hearts.villainInitCard(sortedDeck)
                        break
                    case 1:
                        currentCard = queens.villainInitCard(sortedDeck)
                        break
                    case 2:
                        currentCard = fila.villainInitCard(sortedDeck)
                        break
                    case 4:
                        currentCard = king.villainInitCard(sortedDeck)
                        break

                    default:
                        currentCard = any.villainInitCard(sortedDeck)
                        break
                }
                this.initCard = currentCard

                if (!this.isQuarters) {
                    this.boardCards = [currentCard]
                    this.playersCards[villain] = playerCards.filter(
                        c => c !== currentCard
                    )
                    return
                }
            }

            // filtering players cards w/ the same flush
            const eligeableCards = sortedDeck.filter(
                c => c.flush === this.initCard.flush
            ) as Card[]

            // in case the current loser is not set (the very first turn of any game mode)
            this.currentLoser =
                this.currentLoser >= 0 ? this.currentLoser : this.initPlayer
            let currentCards = [] as Card[]

            // villain is reacting specifically according to the particular game mode
            switch (this.mode) {
                case 0:
                    currentCards = hearts.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.boardCards
                    )
                    break
                case 1:
                    currentCards = queens.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.boardCards
                    )
                    break
                case 4:
                    currentCards = king.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.boardCards
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
                        this.boardCards
                    )
                    break
            }

            // checks if the villain is losing
            if (eligeableCards.length) {
                const currentMaxValue = Math.max(
                    ...currentCards.map(c => c.value)
                )
                this.currentLoser = this.isLoser(currentMaxValue)
                    ? villain
                    : this.currentLoser
            }

            // if any card or more cards were moved add them to the board
            // and deletes from player's deck
            if (currentCards.length) {
                this.boardCards = [...this.boardCards, ...currentCards]
                this.playersCards[villain] = playerCards.filter(
                    c => !currentCards.includes(c)
                )
            } else if (this.isTens) {
                // if no cards could been taken and game mode is tens
                this.tensKnock(villain)
            }
        },
        isLoser(value: number): boolean {
            const boardEligeable = this.boardCards.filter(
                c => c.flush === this.initCard.flush
            )
            // gets value of the current losing board card
            const boardMaxValue = Math.max(...boardEligeable.map(c => c.value))
            return value >= boardMaxValue
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
        quartersNext(): void {
            this.noCardsCheck()
            if (this.playersCards[this.initPlayer].length > 0) {
                for (let i = 0; i < 4; i++) {
                    this.villainTurn(i)
                }
                this.noCardsCheck()
            }
            this.nextTurn()
        },
        tensMoved(): void {
            this.tensPlayed = true
            this.heroCanAct = true
            this.noCardsCheck()
        },
        tensNext(): void {
            this.noCardsCheck()
            for (let i = 0; i < 3; i++) {
                this.villainTurn(i)
                this.noCardsCheck()
            }
            this.tensPlayed = false
        },
        tensKnock(player: number): void {
            if (
                tens.noEligeableCard(
                    this.playersCards[player],
                    this.alreadyPlayedCards
                )
            ) {
                this.currentScore = this.currentScore.map((pts, index) =>
                    index === player ? pts + 1 : pts
                )
                if (player === 3) this.tensNext()
            } else {
                alert('Pozor na renonc!')
            }
        },
        noCardsCheck(): void {
            if (general.noCardsCheck(this.playersCards)) {
                this.calculatePoints()
                this.heroCanAct = false

                this.timer = setTimeout(() => {
                    window.clearTimeout(this.timer)
                    this.nextGame()
                }, this.timeOut)
            }
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
        examinate(): void {
            // examination failed
            if (this.currentScore[this.thalia] > 0) {
                this.currentScore.fill(0)
                this.currentScore[this.thalia] = 8
                this.updateScore({
                    gameMode: `Maturita ${this.examAttempt}`,
                    score: this.currentScore
                })

                if (this.examAttempt < 3) this.setGame(7)
                else this.nextThalia()
            } else {
                // examination passed
                this.updateScore({
                    gameMode: `Maturita ${this.examAttempt}`,
                    score: this.currentScore
                })
                this.nextThalia()
            }
        },
        // eslint-disable-next-line
        examPicked(event: any) {
            this.setGame(event.target.value)
        },
        nextTurn(): void {
            this.timer = setTimeout(() => {
                window.clearTimeout(this.timer)
                // setting up the new init player
                this.initPlayer = this.currentLoser

                // resets data after timeout
                this.boardCards = []

                // initializes opponents turn only if hero has cards
                // and the score has not reached its top yet
                if (
                    this.playersCards[3].length &&
                    this.currentScore.reduce((score, sum) => sum + score) !== 8
                ) {
                    if (!this.isQuarters) {
                        this.allVillainsInit()
                        this.heroCanAct = true
                    } else if (this.initPlayer !== 3) {
                        this.quartersNext()
                    } else this.heroCanAct = true
                } else {
                    this.nextGame()
                }
            }, this.timeOut)
        },
        nextGame(): void {
            if (this.examination) {
                this.examinate()
            } else {
                this.updateScore({
                    gameMode: this.gameMode,
                    score: this.currentScore
                })
                this.nextGameMode()
            }

            this.resetGameStats()
            this.initCards()
            if (this.mode < 7) this.allVillainsInit()
        },
        nextThalia(): void {
            if (this.thalia === 3) this.gameOver()
            this.setGame(0)
            this.setThalia(this.thalia + 1)
            this.turnOffExam()
        },
        resetGameStats(): void {
            this.currentScore = [0, 0, 0, 0]
            this.initPlayer = this.thalia
            this.alreadyPlayedCards = []
            this.initCard = {} as Card
            this.boardCards = []
            this.heroCanAct = this.thalia === 3
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
                this.heroCanAct = false
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
