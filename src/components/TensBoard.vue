<template>
    <div class="board-wrapper">
        <div class="flush-wrapper clubs-wrapper">
            <img
                v-for="card in clubsPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                class="card"
            />
        </div>
        <div class="flush-wrapper spades-wrapper">
            <img
                v-for="card in spadesPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                class="card"
            />
        </div>
        <div class="flush-wrapper diamonds-wrapper">
            <img
                v-for="card in diamondsPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
                class="card"
            />
        </div>
        <div class="flush-wrapper hearts-wrapper">
            <img
                v-for="card in heartsPlayed"
                :key="card.id"
                :src="card.src"
                :alt="card.id"
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
    data() {
        return {
            initCards: [] as Card[]
        }
    },
    computed: {
        clubsPlayed(): Card[] {
            return this.initCards.filter(card => card.flush === 0)
        },
        spadesPlayed(): Card[] {
            return this.initCards.filter(card => card.flush === 1)
        },
        diamondsPlayed(): Card[] {
            return this.initCards.filter(card => card.flush === 2)
        },
        heartsPlayed(): Card[] {
            return this.initCards.filter(card => card.flush === 3)
        }
    },
    created() {
        this.initCards = tens.initCards
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
