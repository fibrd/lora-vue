<template>
    <transition-group name="turned" class="card-wrapper">
        <img
            v-for="n in sortedCards.length"
            :key="n"
            :src="cardBackSrc"
            alt="back"
            :class="{ highlighted: highlighted }"
            class="card"
        />
    </transition-group>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        villainCards: Array as () => Card[],
        highlighted: Boolean
    },
    data() {
        return {
            cardBackSrc: './assets/cards/back.jpg'
        }
    },
    computed: {
        sortedCards(): Card[] {
            return sortBy(this.villainCards, ['id'])
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    position: absolute;
    border: 1px currentColor solid;
    border-radius: 0.4em;
}

.highlighted {
    box-shadow: 0px 0px 4px 4px rgba(37, 114, 1, 0.4);
}

@for $i from 1 through 8 {
    .card:nth-child(#{$i}) {
        transform-origin: 50% 120%;
        transform: rotateZ($i * 3deg - 12deg);
    }
}

.card-wrapper {
    display: flex;
    position: relative;
    justify-content: center;
    &:nth-child(1) {
        left: -30%;
        top: 15em;
    }
    &:nth-child(3) {
        left: +30%;
        top: 15em;
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

@media screen and (max-width: 780px) {
    .card {
        width: 14%;
        min-width: 4em;
        max-width: 5em;
        border-radius: 0.6em;
    }

    .card-wrapper {
        &:nth-child(1) {
            top: 5em;
        }
        &:nth-child(3) {
            top: 5em;
        }
    }
}
@media screen and (max-width: 460px) {
    .card {
        width: 15%;
        min-width: 3em;
    }
}
</style>
