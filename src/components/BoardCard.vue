<template>
    <div class="board">
        <img
            v-for="card in boardCards"
            :key="card.id"
            :src="card.src"
            alt="actual card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'

export default Vue.extend({
    props: {
        boardCards: Array as () => Card[]
    }
})
</script>

<style lang="scss" scoped>
.board {
    min-height: 15em;
    max-width: 40em;
    margin: 2em auto;
    margin-top: 20em;
}

img {
    width: 25%;
}
</style>
