<template>
    <div id="app">
        <div class="opponents-container">
            <villain-deck :villainCards="villainCards[0]" />
            <villain-deck :villainCards="villainCards[1]" />
            <villain-deck :villainCards="villainCards[2]" />
        </div>
        <board-card :boardCards="boardCards" />
        <hero-deck :heroCards="heroCards" @cardTurned="turn($event)" />

        <table>
            <tbody>
                <tr v-for="(score, index) in currentScore" :key="index">
                    <th>{{ index + 1 }}.</th>
                    <td>{{ score }}</td>
                </tr>
            </tbody>
        </table>

        <div id="nav">
            <router-link to="/">Home</router-link>|
            <router-link to="/about">About</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
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
            heroCards: [] as Card[],
            villainCards: [] as Card[][],
            heroCanAct: true,
            currentScore: [0, 0, 0, 0],
            currentLoser: 0,
            initCard: {} as Card
        }
    },
    computed: {
        ...mapState(['cards', 'mode'])
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
            this.villainCards[0] = chunkedDeck[0]
            this.villainCards[1] = chunkedDeck[1]
            this.villainCards[2] = chunkedDeck[2]
            this.heroCards = chunkedDeck[3]
        },
        turn(card: Card) {
            // reaction timeout is set up
            if (!this.heroCanAct) return
            this.heroCanAct = false

            const boardLen = this.boardCards.length

            // calculating init player based on the count of current board cards
            const marginIndex = (4 - boardLen) % 4
            const initPlayer = marginIndex

            // checks if hero's reaction is valid
            if (initPlayer !== 0 && !this.isHeroValid(card)) {
                this.heroCanAct = true
                return
            }

            // checks if hero can play hearts
            if (
                initPlayer === 0 &&
                this.mode === 0 &&
                !this.canPlayHeart(card)
            ) {
                this.heroCanAct = true
                return
            }

            // adding selected card to the board
            this.boardCards.push(card)

            //setting up the new init card
            this.initCard = this.boardCards[0]

            // deletes selected card out of hero's deck
            this.heroCards = this.heroCards.filter(c => c !== card)

            // opponents make their reaction turns
            this.allVillainsReact(boardLen)

            // appointing loser of the current game
            this.currentLoser = this.appointLoser(initPlayer)
            this.calculatePoints()

            setTimeout(() => {
                // resets data after timeout
                this.heroCanAct = true
                this.boardCards = []

                // initializes opponents turn only if hero has cards
                if (this.heroCards.length) {
                    this.allVillainsInit()
                } else {
                    this.nextGame()
                }
            }, 2000)
        },
        canPlayHeart(card: Card): boolean {
            const anyHeartCard = this.heroCards.find(c => c.flush === 3)
            return card.flush !== 3 || anyHeartCard === undefined
        },
        isHeroValid(card: Card): boolean {
            // finds any hero's card with flush equals to the initializing one
            const anyFlushCard = this.heroCards.find(
                c => c.flush === this.initCard.flush
            )
            return (
                card.flush === this.initCard.flush || anyFlushCard === undefined
            )
        },
        allVillainsInit(): void {
            const index = (4 - this.currentLoser) % 4
            const villainMaxIndex = this.villainCards.length - 1

            // setting initializing opponents to make their moves
            for (let i = 0; i < index; i++) {
                this.villainCards[villainMaxIndex - i] = this.villainTurn(
                    villainMaxIndex - i
                )
            }
        },
        allVillainsReact(boardLen: number): void {
            const index = 3 - boardLen

            // setting rest of opponents to make their reactions
            for (let i = 0; i < index; i++) {
                this.villainCards[i] = this.villainTurn(i)
            }
        },
        villainTurn(villain: number): Card[] {
            const villainCards = this.villainCards[villain]
            const sortedDeck = sortBy(villainCards, ['value'])

            // current turn is initializing
            if (this.boardCards.length === 0) {
                const currentCard = sortedDeck[0]
                this.initCard = currentCard
                this.boardCards = [currentCard]
                return villainCards.filter(c => c !== currentCard)
            }

            // filtering players cards w/ the same flush
            const eligeableCards = villainCards.filter(
                c => c.flush === this.initCard.flush
            ) as Card[]

            // if filtered cards add any lower one than the init card
            // otherwise adds a card w/ the biggest value
            let currentCard = eligeableCards.length
                ? eligeableCards.find(c => c.value < this.initCard.value)
                : sortedDeck[sortedDeck.length - 1]

            // if there are some filtered cards with no lower value but the bigger one
            if (!currentCard) currentCard = eligeableCards[0]

            // immutable array push
            this.boardCards = [...this.boardCards, currentCard]
            return villainCards.filter(c => c !== currentCard)
        },
        appointLoser(initPlayer: number): number {
            let currentLoser = initPlayer

            // resorting actual board according to the initial player
            const sortedBoard = slice(
                [...takeRight(this.boardCards, initPlayer), ...this.boardCards],
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
            this.currentScore[this.currentLoser] += 1
        },
        nextGame(): void {
            this.$store.dispatch('updateScore', this.currentScore)
            this.currentScore.fill(0)
            this.currentLoser = 0
            this.initCard = {} as Card
            this.initCards()
        }
    },
    created() {
        this.initCards()
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
</style>
