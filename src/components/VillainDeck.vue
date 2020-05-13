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
img {
    position: absolute;
    width: 7em;
    border: 1px currentColor solid;
    border-radius: 1em;
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
    width: 80%;
    max-width: 50em;
    margin: 0 auto;
    &:nth-child(2) {
        justify-content: center;
        align-items: flex-end;
    }
    &:nth-child(3) {
        justify-content: right;
    }
}

@media screen and (max-width: 780px) {
    img.card {
        width: 12.5%;
        border-radius: 0.6em;
    }
}
</style>
