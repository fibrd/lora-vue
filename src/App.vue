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
        <board-card
            v-if="mode !== 6"
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
        <button v-on:click="giveUp">Give up</button>

        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/level">Level</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import {
    gameModes,
    hearts,
    queens,
    fila,
    any,
    king,
    tens,
    playerNames
} from '@/modes/'
import { mapState } from 'vuex'

// components
import HeroDeck from '@/components/HeroDeck.vue'
import VillainDeck from '@/components/VillainDeck.vue'
import BoardCard from '@/components/BoardCard.vue'
import TensBoard from '@/components/TensBoard.vue'
import TableScore from '@/components/TableScore.vue'

// lodash helpers
import { shuffle, chunk, sortBy, takeRight, slice } from 'lodash-es'

export default Vue.extend({
    components: {
        HeroDeck,
        VillainDeck,
        BoardCard,
        TensBoard,
        TableScore
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
            initCard: {} as Card
        }
    },
    computed: {
        ...mapState(['cards', 'mode', 'timeOut']),
        gameMode() {
            return gameModes.name()
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
            if (!this.heroCanAct) return
            this.heroCanAct = false

            if (!this.validateCard(card)) {
                this.heroCanAct = true
                return
            }

            // adding selected card to the board
            this.boardCards = [...this.boardCards, card]

            //setting up the new init card
            this.initCard = this.boardCards[0]

            // deletes selected card out of hero's deck
            this.playersCards[3] = this.playersCards[3].filter(c => c !== card)

            if (this.mode !== 6) {
                // opponents make their reaction turns
                this.allVillainsReact(this.boardCards.length)
                // appointing loser of the current game
                this.currentLoser = this.appointLoser()
            }

            this.calculatePoints()

            setTimeout(() => {
                // setting up the new init player
                this.initPlayer = this.currentLoser
                this.currentLoser = -1

                // resets data after timeout
                this.heroCanAct = true
                this.boardCards = []

                // initializes opponents turn only if hero has cards
                if (
                    this.playersCards[3].length &&
                    this.currentScore.reduce((score, sum) => sum + score) !== 8
                ) {
                    this.allVillainsInit()
                } else {
                    this.nextGame()
                }
            }, this.timeOut)
        },
        validateCard(card: Card): boolean {
            // checks if hero is turning the valid flush
            // exception for game mode tens
            if (
                this.initPlayer !== 3 &&
                !this.isFlushValid(card) &&
                this.mode !== 6
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
                this.playersCards[villainsCount - 1 - i] = this.villainTurn(
                    villainsCount - 1 - i
                )
            }
        },
        allVillainsReact(boardLen: number): void {
            const maxBoardLen = 4
            // calculates villains count to act
            const villainsToAct = maxBoardLen - boardLen

            // setting rest of opponents to make their reactions
            for (let i = 0; i < villainsToAct; i++) {
                this.playersCards[i] = this.villainTurn(i)
            }
        },
        villainTurn(villain: number): Card[] {
            const playerCards = this.playersCards[villain]
            const sortedDeck = sortBy(playerCards, ['value'])

            // current turn is initializing
            if (this.boardCards.length === 0) {
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
                return playerCards.filter(c => c !== currentCard)
            }

            // filtering players cards w/ the same flush
            const eligeableCards = playerCards.filter(
                c => c.flush === this.initCard.flush
            ) as Card[]

            let currentCard = {} as Card
            switch (this.mode) {
                case 0:
                    currentCard = hearts.villainReactCard(
                        playerCards,
                        eligeableCards,
                        this.initCard
                    )
                    break
                case 1:
                    currentCard = queens.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break
                case 4:
                    currentCard = king.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break

                default:
                    currentCard = any.villainReactCard(
                        sortedDeck,
                        eligeableCards,
                        this.initCard
                    )
                    break
            }

            // immutable array push
            this.boardCards = [...this.boardCards, currentCard]
            return playerCards.filter(c => c !== currentCard)
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
                    score = tens.score(this.alreadyPlayedCards)
                    break

                default:
                    score = any.score(this.boardCards, this.currentLoser)
                    break
            }
            this.currentScore = score.map(
                (pts, index) => pts + this.currentScore[index]
            )
        },
        giveUp(): void {
            if (window.confirm('Really?')) {
                this.currentScore[3] =
                    8 - this.currentScore.reduce((score, sum) => sum + score)
                this.boardCards = []
                this.nextGame()
            }
        },
        nextGame(): void {
            this.$store.dispatch('updateScore', this.currentScore)
            this.$store.dispatch('nextGame')
            this.currentScore = [0, 0, 0, 0]
            this.initPlayer = 3
            this.initCard = {} as Card
            this.initCards()
        }
    },
    watch: {
        boardCards(cards: Card[]) {
            if (cards.length > 0)
                cards.forEach(c => this.alreadyPlayedCards.push(c))
        }
    },
    created() {
        this.initCards()
        this.allVillainsInit()
        this.$store.dispatch('setVillainsNames', playerNames.takeRandomNames())
    }
})
</script>

<style lang="scss">
[v-cloak] {
    display: none;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    overflow: hidden;

    h1 {
        text-align: left;
    }
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

.current-game {
    position: fixed;
    z-index: 20;
}

.card {
    width: 10%;
    max-width: 6em;
}

.villains-container {
    height: 10em;
    width: 80%;
    max-width: 60em;
    margin: 4em auto 0;
}

@media screen and (max-width: 780px) {
    .card {
        width: 20%;
    }
}
@media screen and (max-width: 460px) {
    .card {
        width: 20%;
    }
}
</style>
