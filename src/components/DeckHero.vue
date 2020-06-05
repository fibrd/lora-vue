<template>
    <div class="hero-wrapper">
        <div class="player-name">
            <h5>{{ playerName }} ({{ heroScore }})</h5>
        </div>
        <div class="card-wrapper">
            <img
                v-for="card in cards"
                :key="card.src"
                class="card"
                :src="card.src"
                :alt="card.name"
                @click="$emit('cardTurned', card)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        heroCards: Array as () => Card[]
    },
    computed: {
        ...mapState(['playerName', 'currentScore', 'sortingCards']),
        heroScore(): number {
            return this.currentScore[3]
        },
        sortedCards(): Card[] {
            const sortedCards = sortBy(this.heroCards, ['id'])
            return sortedCards
        },
        cards(): Card[] {
            const cards = this.sortingCards ? this.sortedCards : this.heroCards
            return cards
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    transition: all 0.2s ease-in;
    margin: 0 0.1em;
    &:hover,
    &:focus {
        cursor: pointer;
        transform: scale(1.1);
    }
}
.hero-wrapper {
    position: relative;
    max-width: 60em;
    margin: 0emauto;
}

.player-name {
    margin: 0 auto;
    position: absolute;
    top: -3em;
    z-index: -1;
    width: 100%;

    h4,
    h6 {
        margin: 0 auto;
        width: 60%;
        text-align: left;
    }
}

.turned-enter-active,
.turned-leave-active {
    transition: opacity 0.4s ease;
}

.turned-enter,
.turned-leave-to {
    opacity: 0;
}

@media screen and (max-width: 768px) {
    .card {
        width: 4em;
    }
}
@media screen and (max-width: 520px) {
    .card {
        width: 3.4em;
    }
    .card-wrapper {
        margin: 0;
    }
}
</style>
