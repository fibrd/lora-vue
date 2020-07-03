<template>
    <div id="app">
        <init-page v-if="!started" />
        <div v-if="!gameIsOver && started" class="game-container">
            <page-heading />
            <div class="villains-container">
                <deck-villain
                    v-for="index in 3"
                    :key="index"
                    :villain="index - 1"
                />
            </div>
            <exam-select v-if="mode === 7" />
            <board-cards v-show="!isTens" />
            <board-cards-tens v-show="isTens" />
            <custom-buttons
                v-show="heroCanAct && !isFinished"
                @giveUp="giveUp"
                @tensNext="tensNext"
                @heroKnock="tensKnock(3)"
            />
            <deck-hero
                :heroCards="playersCards[3]"
                @cardTurned="heroTurn($event)"
            />
        </div>
        <hr />
        <div id="nav" class="nav main-navigation">
            <router-link to="/results">Stav</router-link> |
            <router-link to="/records">Rekordy</router-link> |
            <router-link to="/settings">Nastavení</router-link>
        </div>
        <router-view />

        <footer class="main-footer">
            <p>
                &copy; DF 2020
            </p>
            <p>✉ <a href="mailto:hra-lora@email.cz">hra-lora@email.cz</a></p>
            <p>
                🍺
                <a href="https://paypal.me/pools/c/8qdKwlIq7p"
                    >Deset pivek na podporu vývoje</a
                >
            </p>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { Card } from '@/types'

// module methods & properties specific for each game mode
import * as levelEasy from '@/modes/levelEasy'
import * as levelMedium from '@/modes/levelMedium'

// components
import BoardCards from '@/components/BoardCards.vue'
import BoardCardsTens from '@/components/BoardCardsTens.vue'
import DeckHero from '@/components/DeckHero.vue'
import DeckVillain from '@/components/DeckVillain.vue'
import ExamSelect from '@/components/ExamSelect.vue'
import CustomButtons from '@/components/CustomButtons.vue'
import InitPage from '@/components/InitPage.vue'
import PageHeading from '@/components/PageHeading.vue'

// lodash helpers
import { shuffle, chunk, sortBy } from 'lodash-es'

export default Vue.extend({
    components: {
        DeckHero,
        DeckVillain,
        BoardCards,
        BoardCardsTens,
        ExamSelect,
        CustomButtons,
        InitPage,
        PageHeading
    },
    computed: {
        ...mapState([
            'alreadyPlayedCards',
            'boardCards',
            'playersCards',
            'initCard',
            'initPlayer',
            'heroCanAct',
            'currentScore',
            'currentLoser',
            'tensPlayed',
            'isFinished',
            'cards',
            'mode',
            'timeOut',
            'examination',
            'thalia',
            'gameIsOver',
            'examAttempt',
            'started',
            'level'
        ]),
        utils() {
            return this.level === 'easy' ? levelEasy : levelMedium
        },
        gameMode() {
            return levelEasy.general.gameMode()
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
            'setPlayersCards',
            'setAlreadyPlayedCards',
            'setHeroCanAct',
            'setBoardCards',
            'setInitCard',
            'setInitPlayer',
            'setCurrentLoser',
            'setCurrentScore',
            'setTensPlayed',
            'setIsFinished',
            'setPlayerName',
            'setVillainsNames',
            'updateScore',
            'turnOnExam',
            'turnOffExam',
            'nextGameMode',
            'setGame',
            'setThalia',
            'setGameOver',
            'setExamAttempt',
            'setTimeOut',
            'setSortingCards'
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
            this.setPlayersCards(chunkedDeck)
        },
        // called after the hero makes any move
        heroTurn(card: Card) {
            // checks if the hero is allowed to act
            if (!this.heroCanAct) return
            if (this.isFinished) return

            // not allowed while choosing an exam mode
            if (this.mode === 7) return

            // validate this card specifically for each game mode
            if (!this.isCardValid(card)) return

            // disables hero moves for a moment
            this.setHeroCanAct(false)

            // deletes selected card out of hero's deck
            const playersCards = this.playersCards as Card[][]
            playersCards[3] = playersCards[3].filter(c => c !== card)
            this.setPlayersCards(playersCards)

            // adding selected card to the board
            const boardCards = [...this.boardCards, card] as Card[]
            this.setBoardCards(boardCards)

            // all the modes except for tens
            if (this.mode < 6) {
                //setting up the new init card
                this.setInitCard(this.boardCards[0])
                // all the modes except for tens and quarters
                if (this.mode < 5) {
                    // opponents make their reaction turns
                    this.allVillainsReact(this.boardCards.length)
                    // appointing loser of the current game
                    if (card.flush === this.initCard.flush) {
                        if (this.isLoser(card.value)) this.setCurrentLoser(3)
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
                !this.utils.general.isFlushValid(
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
                        !this.utils.hearts.canInitHeart(card)
                    )
                        return false
                    break
                case 4:
                    if (
                        this.initPlayer === 3 &&
                        !this.utils.king.canInitHeart(card)
                    )
                        return false
                    if (this.utils.king.isRedKingFirst(card)) return false
                    break
                case 5:
                    if (
                        this.playersCards[3].length === 8 &&
                        !this.utils.quarters.canInitCard(
                            card,
                            this.playersCards[3]
                        )
                    )
                        return false
                    if (
                        this.initPlayer !== 3 &&
                        !this.utils.quarters.canPlayCard(card, this.initCard)
                    )
                        return false
                    break
                case 6:
                    if (!this.utils.tens.canPlayCard(card, [])) return false
                    break
            }
            return true
        },
        allVillainsInit(): void {
            if (this.isFinished) return
            const villainsCount = 3
            // calculates villains count to act
            const villainsToAct = villainsCount - this.initPlayer

            // forces opponents to make their initializing moves
            for (let i = 0; i < villainsToAct; i++) {
                // editting their order based on the initilizing player
                const marginIndex = (i + this.initPlayer) % 4
                this.villainTurn(marginIndex)
            }
            this.setHeroCanAct(true)
            if (this.isQuarters && this.initPlayer !== 3) this.quartersNext()
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
        // eslint-disable-next-line
        villainTurn(villain: number): void {
            // defines & sorts the player's cards
            const playerCards = this.playersCards[villain]
            const sortedDeck = sortBy(playerCards, ['value'])

            // this turn is initializing
            if (this.boardCards.length === 0 && !this.isTens) {
                let currentCard = {} as Card
                switch (this.mode) {
                    case 0:
                        currentCard = this.utils.hearts.villainInitCard(
                            sortedDeck
                        )
                        break
                    case 1:
                        currentCard = this.utils.queens.villainInitCard(
                            sortedDeck
                        )
                        break
                    case 2:
                        currentCard = this.utils.fila.villainInitCard(
                            sortedDeck
                        )
                        break
                    case 4:
                        currentCard = this.utils.king.villainInitCard(
                            sortedDeck
                        )
                        break
                    case 5:
                        currentCard = this.utils.quarters.villainInitCard(
                            sortedDeck
                        )
                        break

                    default:
                        currentCard = this.utils.any.villainInitCard(sortedDeck)
                        break
                }

                this.setInitCard(currentCard)

                if (!this.isQuarters) {
                    this.setBoardCards([currentCard])
                    const playersCards = this.playersCards as Card[][]
                    playersCards[villain] = playersCards[villain].filter(
                        c => c !== currentCard
                    )
                    this.setPlayersCards(playersCards)

                    return
                }
            }

            // in case the current loser is not set (the very first turn of any game mode)
            if (this.currentLoser < 0) this.setCurrentLoser(this.initPlayer)

            let currentCards = [] as Card[]

            // villain is reacting specifically according to the particular game mode
            switch (this.mode) {
                case 0:
                    currentCards = this.utils.hearts.villainReactCard(
                        sortedDeck
                    )
                    break
                case 1:
                    currentCards = this.utils.queens.villainReactCard(
                        sortedDeck
                    )
                    break
                case 2:
                    currentCards = this.utils.fila.villainReactCard(sortedDeck)
                    break
                case 4:
                    currentCards = this.utils.king.villainReactCard(sortedDeck)
                    break
                case 5:
                    currentCards = this.utils.quarters.villainReactCards(
                        playerCards
                    )
                    break
                case 6:
                    currentCards = this.utils.tens.villainTurn(sortedDeck)
                    break

                default:
                    currentCards = this.utils.any.villainReactCard(sortedDeck)
                    break
            }

            // checks if the villain is losing
            const eligeableCard = sortedDeck.find(
                c => c.flush === this.initCard.flush
            )
            if (eligeableCard) {
                const currentMaxValue = Math.max(
                    ...currentCards.map(c => c.value)
                )
                if (this.isLoser(currentMaxValue)) this.setCurrentLoser(villain)
            }

            // if any card or more cards were moved add them to the board
            // and deletes from player's deck
            if (currentCards.length) {
                this.setBoardCards([...this.boardCards, ...currentCards])
                const playersCards = this.playersCards as Card[][]
                playersCards[villain] = playersCards[villain].filter(
                    c => !currentCards.includes(c)
                )
                this.setPlayersCards(playersCards)
            } else if (this.isTens) {
                // if no cards could been taken and game mode is tens
                this.tensKnock(villain)
            }
        },
        isLoser(value: number): boolean {
            const boardEligeable = this.boardCards.filter(
                (c: Card) => c.flush === this.initCard.flush
            ) as Card[]
            // gets value of the current losing board card
            const boardMaxValue = Math.max(...boardEligeable.map(c => c.value))
            return value >= boardMaxValue
        },
        calculatePoints(): void {
            let score = []
            switch (this.mode) {
                case 0:
                    score = this.utils.hearts.score()
                    break
                case 1:
                    score = this.utils.queens.score()
                    break
                case 2:
                    score = this.utils.fila.score()
                    break
                case 4:
                    score = this.utils.king.score()
                    break
                case 5:
                    score = this.utils.tens.score()
                    break
                case 6:
                    score = this.utils.tens.score()
                    break

                default:
                    score = this.utils.any.score()
                    break
            }
            this.setCurrentScore(
                score.map((pts, index) => pts + this.currentScore[index])
            )
        },
        quartersNext(): void {
            if (this.isFinished) return
            this.setHeroCanAct(false)
            this.villainTurn(this.initPlayer)
            this.noCardsCheck().then(result => {
                if (!result || this.boardCards.length > 1) {
                    for (let i = 1; i <= 3; i++) {
                        const marginIndex = (i + this.initPlayer) % 4
                        this.villainTurn(marginIndex)
                    }
                    this.noCardsCheck()
                    this.nextTurn()
                }
            })
        },
        tensMoved(): void {
            if (this.isFinished) return
            this.setTensPlayed(true)
            this.noCardsCheck()
            if (!this.heroCanAct) this.setHeroCanAct(true)
        },
        tensNext(): void {
            this.setHeroCanAct(false)
            this.villainTurn(0)
            this.setInitPlayer(3)
            this.noCardsCheck().then(result => {
                if (!result && !this.isFinished) {
                    this.villainTurn(1)
                    this.noCardsCheck().then(result => {
                        if (!result && !this.isFinished) {
                            this.villainTurn(2)

                            this.noCardsCheck()
                            this.setHeroCanAct(true)
                        }
                    })
                }
            })

            this.setTensPlayed(false)
        },
        tensKnock(player: number): void {
            if (this.utils.tens.noEligeableCard(this.playersCards[player])) {
                this.setCurrentScore(
                    this.currentScore.map((pts: number, index: number) =>
                        index === player ? pts + 1 : pts
                    )
                )
                if (player === 3) this.tensNext()
            } else {
                alert('Pozor na renonc!')
            }
        },
        // eslint-disable-next-line
        noCardsCheck(): Promise<any> {
            if (this.utils.general.noCardsCheck() && !this.isFinished) {
                this.setIsFinished(true)
                this.setHeroCanAct(false)
                setTimeout(() => {
                    this.calculatePoints()
                    this.nextGame()
                }, this.timeOut * 2)
            }
            const promise = new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.utils.general.noCardsCheck())
                }, this.timeOut / 2)
            })
            return promise
        },
        giveUp(): void {
            if (window.confirm('Chcete hru dobrovolně vzdát?')) {
                const pointsReached = this.currentScore.reduce(
                    (score: number, sum: number) => sum + score
                )
                const currentScore = this.currentScore
                currentScore[3] = currentScore[3] + 8 - pointsReached
                this.setCurrentScore(currentScore)

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
        nextTurn(): void {
            if (this.isFinished) return
            const timeOut = this.isQuarters ? this.timeOut * 2 : this.timeOut
            const timer = setTimeout(() => {
                window.clearTimeout(timer)
                // setting up the new init player
                this.setInitPlayer(this.currentLoser)

                // resets data after timeout
                this.setBoardCards([])

                // initializes opponents turn only if hero has cards
                // and the score has not reached its top yet
                const pointsReached = this.currentScore.reduce(
                    (score: number, sum: number) => sum + score
                )
                if (this.playersCards[3].length && pointsReached !== 8) {
                    if (!this.isQuarters) {
                        this.allVillainsInit()
                        this.setHeroCanAct(true)
                    } else if (this.initPlayer !== 3) {
                        this.quartersNext()
                    } else this.setHeroCanAct(true)
                } else {
                    this.nextGame()
                }
            }, timeOut)
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
                this.resetGameStats()
                this.initCards()
                this.allVillainsInit()
            }
        },
        nextThalia(): void {
            if (this.thalia > 2) this.gameOver()
            else {
                this.setThalia(this.thalia + 1)
                this.setGame(0)
                this.turnOffExam()
                this.resetGameStats()
                this.initCards()
                this.allVillainsInit()
            }
        },
        loadLocalStorage(): void {
            const playerName = localStorage.getItem('playerName') || 'Hero'
            const timeOut = localStorage.getItem('timeOut') || 2000
            const sorting = localStorage.getItem('sorting')
            this.setPlayerName(playerName)
            this.setTimeOut(timeOut)
            if (sorting) this.setSortingCards(JSON.parse(sorting))
        },
        resetGameStats(): void {
            this.setCurrentScore([0, 0, 0, 0])
            this.setCurrentLoser(-1)
            this.setInitPlayer(this.thalia)
            this.setAlreadyPlayedCards([])
            this.setInitCard({} as Card)
            this.setBoardCards([])
            this.setHeroCanAct(this.thalia === 3)
            if (this.isFinished) this.setIsFinished(false)
            if (this.tensPlayed) this.setTensPlayed(false)
        },
        gameOver(): void {
            window.alert(
                'Konec hry! Nyní můžete svůj výsledek uložit do tabulky rekordů.'
            )
            this.$router.push({ name: 'Results' })
            this.setGameOver()
        }
    },
    watch: {
        mode(value: number) {
            if (value === 7) {
                this.setHeroCanAct(false)
                this.setExamAttempt(this.examAttempt + 1)

                this.turnOnExam()
                this.resetGameStats()
                this.initCards()
                if (this.initPlayer !== 3) {
                    this.setGame(
                        this.utils.exam.selectGame(
                            this.playersCards[this.initPlayer]
                        )
                    )
                    this.allVillainsInit()
                }
            }
        }
    },
    created() {
        this.loadLocalStorage()
        this.setVillainsNames(this.utils.general.randomNames())
        this.resetGameStats()
        this.initCards()
        this.allVillainsInit()
    }
})
</script>

<style src="@/assets/main.scss" lang="scss"></style>
