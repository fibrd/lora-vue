<template>
    <div class="card-wrapper">
        <img
            v-for="card in sortedCards"
            :key="card.id"
            class="card"
            :src="card.src"
            :alt="card.name"
            @click="$emit('cardTurned', card)"
        />
    </div>
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
    width: 12.5%;
    &:hover,
    &:focus {
        cursor: pointer;
        transform: scale(1.1);
    }
}

.card-wrapper {
    max-width: 60em;
    margin: 4em auto;
}

@media screen and (max-width: 600px) {
    .card {
        width: 20%;
    }
}
@media screen and (max-width: 360px) {
    .card {
        width: 25%;
    }
}
</style>
