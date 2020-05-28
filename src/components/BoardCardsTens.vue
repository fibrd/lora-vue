<template>
    <div class="board-wrapper">
        <div class="flush-wrapper" v-for="flush in 4" :key="flush">
            <img
                v-for="card in flushSortedCards[flush - 1]"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                :class="{ blank: card.src === blankSrc }"
                class="card"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Card } from '@/types'
import { tens } from '@/modes'

export default Vue.extend({
    data() {
        return {
            cardsPlayed: [] as Card[],
            blankSrc: './assets/cards/blank.png'
        }
    },
    computed: {
        ...mapState(['alreadyPlayedCards']),
        flushSortedCards(): Card[][] {
            return [
                this.filterFlush(this.cardsPlayed, 0),
                this.filterFlush(this.cardsPlayed, 1),
                this.filterFlush(this.cardsPlayed, 2),
                this.filterFlush(this.cardsPlayed, 3)
            ]
        }
    },
    methods: {
        filterFlush(cards: Card[], flush: number): Card[] {
            return cards.filter(card => card.flush === flush)
        },
        addNewCards(cards: Card[]): void {
            let newCards = this.cardsPlayed
            cards.forEach(newCard => {
                newCards = newCards.map(card => {
                    return card.id === newCard.id ? newCard : card
                })
            })
            this.cardsPlayed = newCards
        }
    },
    watch: {
        alreadyPlayedCards(value: Card[]) {
            this.addNewCards(value)
        }
    },
    created() {
        this.cardsPlayed = tens.initCards
        this.addNewCards(this.alreadyPlayedCards)
    }
})
</script>

<style lang="scss" scoped>
.flush-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
}

@for $i from 1 through 4 {
    .flush-wrapper:nth-child(#{$i}) {
        top: $i * -2em +2em;
    }
}
.card {
    position: relative;
    width: 5em;
}

.blank {
    opacity: 0;
}

@for $i from 1 through 8 {
    .card:nth-child(#{$i}) {
        left: 9em - $i * 2em;
    }
}

@media screen and (max-width: 768px) {
    .card {
        width: 4.5em;
    }
    @for $i from 1 through 4 {
        .flush-wrapper:nth-child(#{$i}) {
            top: $i * -3em + 8em;
        }
    }
    @for $i from 1 through 8 {
        .card:nth-child(#{$i}) {
            left: $i * -1em + 6em;
        }
    }
}

@media screen and (max-width: 460px) {
    .card {
        width: 3.5em;
    }
    @for $i from 1 through 4 {
        .flush-wrapper:nth-child(#{$i}) {
            top: $i * -1.5em + 3em;
        }
    }
}
</style>
