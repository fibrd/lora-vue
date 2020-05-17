<template>
    <div class="board-wrapper">
        <div class="flush-wrapper clubs-wrapper">
            <img
                v-for="card in clubsPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                :class="{ blank: card.src === blankSrc }"
                class="card"
            />
        </div>
        <div class="flush-wrapper spades-wrapper">
            <img
                v-for="card in spadesPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                :class="{ blank: card.src === blankSrc }"
                class="card"
            />
        </div>
        <div class="flush-wrapper diamonds-wrapper">
            <img
                v-for="card in diamondsPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                :class="{ blank: card.src === blankSrc }"
                class="card"
            />
        </div>
        <div class="flush-wrapper hearts-wrapper">
            <img
                v-for="card in heartsPlayed"
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
import { Card } from '@/types'
import { tens } from '@/modes'

export default Vue.extend({
    props: {
        playedCards: Array as () => Card[]
    },
    data() {
        return {
            cards: [] as Card[],
            blankSrc: './assets/cards/blank.png'
        }
    },
    computed: {
        cardsPlayer(): Card[] {
            return this.playedCards
        },
        clubsPlayed(): Card[] {
            return this.filterFlush(this.cards, 0)
        },
        spadesPlayed(): Card[] {
            return this.filterFlush(this.cards, 1)
        },
        diamondsPlayed(): Card[] {
            return this.filterFlush(this.cards, 2)
        },
        heartsPlayed(): Card[] {
            return this.filterFlush(this.cards, 3)
        }
    },
    methods: {
        filterFlush(cards: Card[], flush: number): Card[] {
            return cards.filter(card => card.flush === flush)
        }
    },
    watch: {
        playedCards(cardsPlayed: Card[]) {
            let newCards = this.cards
            cardsPlayed.forEach(newCard => {
                newCards = newCards.map(card => {
                    return card.id === newCard.id ? newCard : card
                })
            })
            this.cards = newCards
        }
    },
    created() {
        this.cards = tens.initCards
    }
})
</script>

<style lang="scss" scoped>
.flush-wrapper {
    display: flex;
    justify-content: center;
    position: relative;
}

@for $i from 1 through 4 {
    .flush-wrapper:nth-child(#{$i}) {
        top: 8em - $i * 4em;
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

@media screen and (max-width: 780px) {
    .card {
        width: 4em;
    }

    @for $i from 1 through 8 {
        .card:nth-child(#{$i}) {
            left: 2.25em - $i * 0.5em;
        }
    }
}

@media screen and (max-width: 460px) {
    .clubs-wrapper {
        top: 2em;
    }
    .spades-wrapper {
        top: 0em;
    }
    .diamonds-wrapper {
        top: -2em;
    }
    .hearts-wrapper {
        top: -4em;
    }
}
</style>
