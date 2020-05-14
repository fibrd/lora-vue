<template>
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
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        heroCards: Array as () => Card[]
    },
    computed: {
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

.card-wrapper {
    max-width: 60em;
    margin: 2em auto;
    position: relative;
    top: -4em;
}

.turned-enter-active,
.turned-leave-active {
    transition: opacity 0.4s ease;
}

.turned-enter,
.turned-leave-to {
    opacity: 0;
}
</style>
