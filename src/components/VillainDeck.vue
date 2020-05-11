<template>
    <div class="card-wrapper">
        <img
            v-for="n in sortedCards.length"
            :key="n"
            :src="cardBackSrc"
            alt="back"
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
img {
    position: absolute;
    width: 10em;
    border: 1px currentColor solid;
    border-radius: 1em;
    box-shadow: 1px -1px 1px;
}

@for $i from 1 through 8 {
    img:nth-child(#{$i}) {
        transform: rotateZ(-12deg + $i * 3deg);
        transform-origin: 50% 120%;
    }
}

.card-wrapper {
    display: flex;
    max-width: 40em;
    margin: 0 auto;
    &:nth-child(2) {
        justify-content: center;
    }
    &:nth-child(3) {
        justify-content: right;
    }
}

@media screen and (max-width: 780px) {
    img {
        width: 25%;
        border-radius: 0.6em;
    }
}
</style>
