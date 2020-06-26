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
import { tens } from '@/modes/levelEasy'

export default Vue.extend({
    data() {
        return {
            cardsPlayed: [] as Card[],
            blankSrc: '/assets/cardsmini/blank.jpg'
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
    width: 100%;
    height: 21em;
}
.flush-wrapper {
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
    max-height: 8.33em;
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
        max-height: 18em;
    }
    .card {
        width: 4em;
        max-height: 6.67em;
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

@media screen and (max-width: 560px) {
    .card {
        min-width: 4em;
    }
    @for $i from 1 through 4 {
        .flush-wrapper:nth-child(#{$i}) {
            top: 5.5em + $i * -4.2em;
        }
    }
    @for $i from 1 through 8 {
        .card:nth-child(#{$i}) {
            left: $i * -1.5em + 6.75em;
        }
    }
}
</style>
