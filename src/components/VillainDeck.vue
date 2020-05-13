<template>
    <div class="card-wrapper">
        <img
            v-for="n in sortedCards.length"
            :key="n"
            :src="cardBackSrc"
            alt="back"
            class="card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        villainCards: Array as () => Card[]
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
    box-shadow: 1px -1px 1px;
}

@for $i from 1 through 8 {
    img:nth-child(#{$i}) {
        transform-origin: 50% 120%;
        transform: rotateZ($i * 5deg - 20deg);
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

@media screen and (max-width: 780px) {
    img.card {
        width: 15%;
        min-width: 3em;
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
</style>
