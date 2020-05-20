<template>
    <div class="hero-wrapper">
        <div class="player-name">
            <h5>{{ playerName }} ({{ currentScore }})</h5>
        </div>
        <transition-group name="turned" class="card-wrapper">
            <img
                v-for="card in sortedCards"
                :key="card.id"
                class="card"
                :src="card.src"
                :alt="card.name"
                @click="$emit('cardTurned', card)"
            />
        </transition-group>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        heroCards: Array as () => Card[],
        currentScore: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapState(['playerName']),
        sortedCards(): Card[] {
            return sortBy(this.heroCards, ['id'])
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
    margin: 0em auto;
}

.player-name {
    position: absolute;
    top: -3em;
    z-index: 25;
    width: 100%;

    h4,
    h6 {
        margin: 0 auto;
        width: 80%;
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

@media screen and (max-width: 460px) {
    .card {
        width: 3.5em;
    }
}
</style>
