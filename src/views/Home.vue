<template>
    <div class="home">
        <h1>{{ easyGame }}</h1>
        <div v-for="card in cards" :key="card.id" class="card">
            <img :src="card.src" :alt="card.name" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { mapState } from 'vuex'

export default Vue.extend({
    computed: {
        ...mapState({
            // eslint-disable-next-line
            cards: (state: any): Card[] => state.cards
        }),
        easyGame() {
            return 1 + 5
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    display: inline;
    img {
        width: 25%;
        max-width: 10em;
    }
}

.home {
    max-width: 40em;
    margin: 2em auto;
}

@media screen and (max-width: 600px) {
    .card img {
        width: 50%;
    }
}
</style>
