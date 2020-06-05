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
.board-wrapper {
    height: 21em;
}
.flush-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
}

@for $i from 1 through 4 {
    .flush-wrapper:nth-child(#{$i}) {
        top: $i * -5em + 5em;
    }
}
.card {
    position: relative;
    width: 5em;
    max-height: 7.5em;
}

.blank {
    opacity: 0;
}

@for $i from 1 through 8 {
    .card:nth-child(#{$i}) {
        left: 12em - $i * 2.5em;
    }
}

@media screen and (max-width: 768px) {
    .board-wrapper {
        height: 18em;
    }
    .card {
        width: 4em;
        max-height: 6em;
    }
    @for $i from 1 through 4 {
        .flush-wrapper:nth-child(#{$i}) {
            top: $i * -4em + 4em;
        }
    }
    @for $i from 1 through 8 {
        .card:nth-child(#{$i}) {
            left: $i * -2em + 10em;
        }
    }
}

@media screen and (max-width: 520px) {
    .board-wrapper {
        width: 100%;
        height: 18em;
    }
    .card {
        width: 3.2em;
        max-height: 4.8em;
    }
    @for $i from 1 through 4 {
        .flush-wrapper:nth-child(#{$i}) {
            top: $i * -2.6em + 4em;
        }
    }
    @for $i from 1 through 8 {
        .card:nth-child(#{$i}) {
            left: 0.2em;
        }
    }
}
</style>
