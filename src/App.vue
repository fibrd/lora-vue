<template>
    <div id="app">
        <h1 class="current-game">{{ gameMode }}</h1>
        <div class="villains-container">
            <villain-deck :villainCards="playersCards[0]" />
            <villain-deck :villainCards="playersCards[1]" />
            <villain-deck :villainCards="playersCards[2]" />
        </div>
        <board-card :boardCards="boardCards" :initPlayer="initPlayer" />
        <hero-deck
            :heroCards="playersCards[3]"
            @cardTurned="heroTurn($event)"
        />

        <ol>
            <li v-for="(score, index) in currentScore" :key="index">
                {{ score }}
            </li>
        </ol>

        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/results">Results</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { hearts, queens, fila, any, king } from '@/modes/'
import { mapState } from 'vuex'

// components
import HeroDeck from '@/components/HeroDeck.vue'
import VillainDeck from '@/components/VillainDeck.vue'
import BoardCard from '@/components/BoardCard.vue'

// lodash helpers
import { shuffle, chunk, sortBy, takeRight, slice } from 'lodash-es'

export default Vue.extend({
    components: {
        HeroDeck,
        VillainDeck,
        BoardCard
    },
    data() {
        return {
            boardCards: [] as Card[],
            playersCards: [] as Card[][],
            heroCanAct: true,
            currentScore: [0, 0, 0, 0],
            initPlayer: 3,
            initCard: {} as Card
        }
    },
    computed: {
        ...mapState(['cards', 'mode']),
        gameMode() {
            let game = ''
            switch (this.mode) {
                case 0:
                    game = 'Červený'
                    break
                case 1:
                    game = 'Filky'
                    break
                case 2:
                    game = 'PrPo'
                    break
                case 3:
                    game = 'Všechny'
                    break
                case 4:
                    game = 'Bedrník'
                    break

                default:
                    break
            }
            return game
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

            // opponents make their reaction turns
            this.allVillainsReact(this.boardCards.length)

            // appointing loser of the current game
            const currentLoser = this.appointLoser()
            this.calculatePoints(currentLoser)

            setTimeout(() => {
                // setting up the new init player
                this.initPlayer = currentLoser

                // resets data after timeout
                this.heroCanAct = true
                this.boardCards = []

                // initializes opponents turn only if hero has cards
                if (this.playersCards[3].length) {
                    this.allVillainsInit()
                } else {
                    this.nextGame()
                }
            }, 2000)
        },
        validateCard(card: Card): boolean {
            // checks if hero is turning the valid flush
            if (this.initPlayer !== 3 && !this.isFlushValid(card)) {
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
        calculatePoints(currentLoser: number): void {
            let score = 0
            switch (this.mode) {
                case 0:
                    score = hearts.score(this.boardCards)
                    break
                case 1:
                    score = queens.score(this.boardCards)
                    break
                case 2:
                    score = fila.score(this.playersCards[3].length)
                    break
                case 4:
                    score = king.score(this.boardCards)
                    break

                default:
                    score = 1
                    break
            }
            this.currentScore[currentLoser] += score
        },
        nextGame(): void {
            this.$store.dispatch('updateScore', this.currentScore)
            this.$store.dispatch('nextGame')
            this.currentScore.fill(0)
            this.initPlayer = 3
            this.initCard = {} as Card
            this.initCards()
        }
    },
    created() {
        this.initCards()
        this.allVillainsInit()
    }
})
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

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

.card {
    width: 10%;
    max-width: 6em;
}

.villains-container {
    height: 10em;
    max-width: 80em;
    margin: 0 auto;
}

@media screen and (max-width: 780px) {
    .card {
        width: 20%;
    }
}
@media screen and (max-width: 360px) {
    .card {
        width: 25%;
    }
}
</style>
