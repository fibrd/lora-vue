<template>
    <div class="home">
        <div class="opponents-container">
            <villain-deck :villainCards="villainCards[0]" />
            <villain-deck :villainCards="villainCards[1]" />
            <villain-deck :villainCards="villainCards[2]" />
        </div>
        <board-card :boardCards="boardCards" />
        <hero-deck :heroCards="heroCards" @cardTurned="turn($event)" />
        <ol>
            <li v-for="(score, index) in currentScore" :key="index">
                {{ score }}
            </li>
        </ol>
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
            currentScore: [0, 0, 0, 0],
            heroIsNext: true
        }
    },
    computed: {
        ...mapState({
            // eslint-disable-next-line
            cards: (state: any): Card[] => state.cards
        }),
        shuffledDeck(): Card[] {
            return shuffle(this.cards)
        },
        chunkedDeck(): Card[][] {
            return chunk(this.shuffledDeck, 8)
        }
    },
    methods: {
        turn(card: Card) {
            if (!this.heroIsNext) return
            this.heroIsNext = false

            // if (this.isHeart(card)) {
            //     if (this.heroCards.find(c => c.id <= 24)) return
            // }
            const boardLen = this.boardCards.length
            const initUser = (4 - boardLen) % 4

            this.boardCards.push(card)
            const initCard = this.boardCards[0]
            this.heroCards = this.heroCards.filter(c => c !== card)

            // this.villainCards = this.villainCards.map(villain =>
            //     this.villainsTurn(villain, card)
            // )

            if (this.boardCards.length < 4)
                this.villainCards[0] = this.villainsTurn(
                    this.villainCards[0],
                    initCard
                )
            if (this.boardCards.length < 4)
                this.villainCards[1] = this.villainsTurn(
                    this.villainCards[1],
                    initCard
                )
            if (this.boardCards.length < 4)
                this.villainCards[2] = this.villainsTurn(
                    this.villainCards[2],
                    initCard
                )

            const currentLoser = this.appointLoser(initUser)
            this.calculatePoints(currentLoser)

            setTimeout(() => {
                this.boardCards = []
                this.heroIsNext = true
                if (currentLoser === 3) {
                    this.villainCards[2] = this.villainsTurn(
                        this.villainCards[2],
                        card
                    )
                }
                if (currentLoser === 2) {
                    this.villainCards[1] = this.villainsTurn(
                        this.villainCards[1],
                        card
                    )
                    this.villainCards[2] = this.villainsTurn(
                        this.villainCards[2],
                        card
                    )
                }
                if (currentLoser === 1) {
                    this.villainCards[0] = this.villainsTurn(
                        this.villainCards[0],
                        card
                    )
                    this.villainCards[1] = this.villainsTurn(
                        this.villainCards[1],
                        card
                    )
                    this.villainCards[2] = this.villainsTurn(
                        this.villainCards[2],
                        card
                    )
                }
            }, 3000)
        },
        isHeart(card: Card) {
            return card.id > 24
        },
        villainsTurn(villain: Card[], card: Card): Card[] {
            const flush = this.flush(card)
            const value = this.value(card)
            const sortedDeck = sortBy(villain, ['id'])
            const eligeableCards = villain.filter(
                c => this.flush(c) === flush
            ) as Card[]
            let currentCard = eligeableCards.length
                ? eligeableCards.find(c => this.value(c) < value)
                : sortedDeck[sortedDeck.length - 1]
            if (!currentCard) currentCard = eligeableCards[0]

            this.boardCards = [...this.boardCards, currentCard]
            return villain.filter(c => c !== currentCard)
        },
        appointLoser(initUser: number): number {
            let currentLoser = initUser
            const sortedBoard = slice(
                [...takeRight(this.boardCards, initUser), ...this.boardCards],
                0,
                4
            )
            console.log(sortedBoard)
            sortedBoard.forEach((card, index) => {
                const loserCard = sortedBoard[currentLoser]
                if (
                    this.flush(card) === this.flush(loserCard) &&
                    this.value(card) > this.value(loserCard)
                )
                    currentLoser = index
            })
            return currentLoser
        },
        calculatePoints(currentLoser: number): void {
            this.currentScore[currentLoser] += 1
        },
        flush(card: Card): number {
            return Math.floor((card.id - 1) / 8)
        },
        value(card: Card): number {
            return Math.floor((card.id - 1) % 8)
        }
    },
    created() {
        this.villainCards[0] = this.chunkedDeck[0]
        this.villainCards[1] = this.chunkedDeck[1]
        this.villainCards[2] = this.chunkedDeck[2]
        this.heroCards = this.chunkedDeck[3]
    }
})
</script>
