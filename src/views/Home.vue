<template>
    <div class="home">
        <div class="opponents-container">
            <villain-deck :villainCards="villainCards[0]" />
            <villain-deck :villainCards="villainCards[1]" />
            <villain-deck :villainCards="villainCards[2]" />
        </div>
        <board-card :boardCards="boardCards" />
        <hero-deck :heroCards="heroCards" @cardTurned="turn($event)" />
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
import { shuffle, chunk, sortBy } from 'lodash-es'

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
            villainCards: [] as Card[][]
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
            if (this.isHeart(card)) {
                if (this.heroCards.find(c => c.id <= 24)) return
            }
            this.boardCards = [card]
            this.heroCards = this.heroCards.filter(c => c !== card)

            this.villainCards = this.villainCards.map(villain => {
                return this.villainsTurn(villain, card)
            })
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
