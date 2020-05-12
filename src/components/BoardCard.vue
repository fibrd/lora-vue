<template>
    <transition-group tag="div" name="fade" class="board" mode="out-in" appear>
        <img
            v-for="card in boardCards"
            :key="card.id"
            :src="card.src"
            alt="actual card"
        />
    </transition-group>
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
    max-width: 30em;
    margin: 2em auto;
    margin-top: 15em;

    img {
        width: 25%;
    }
}

.fade-enter-active {
    transition: all 0.4s ease;
}
.fade-enter {
    opacity: 0;
}
</style>
