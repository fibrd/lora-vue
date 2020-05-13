<template>
    <div class="board-wrapper">
        <img :src="sortedBoard[0].src" class="board-card" />
        <img :src="sortedBoard[1].src" class="board-card" />
        <img :src="sortedBoard[2].src" class="board-card" />
        <img :src="sortedBoard[3].src" class="board-card" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card, BoardCard } from '@/types'

export default Vue.extend({
    props: {
        boardCards: Array as () => Card[],
        initPlayer: Number
    },
    computed: {
        sortedBoard() {
            const sortedBoard = [] as BoardCard[]

            // resorting actual board according to the initial player
            for (let i = 0; i < 4; i++) {
                const sortIndex = (i + this.initPlayer) % 4
                sortedBoard[sortIndex] = this.boardCards[i]
                    ? { playerId: i, src: this.boardCards[i].src }
                    : { playerId: -1, src: '' }
            }
            return sortedBoard
        }
    }
})
</script>

<style lang="scss" scoped>
.board-wrapper {
    position: relative;
    min-height: 10em;
    max-width: 30em;
    margin: 2em auto 10em;
    .board-card {
        width: 25%;
        &:nth-child(2) {
            position: relative;
            top: -6em;
        }
        &:nth-child(4) {
            position: absolute;
            left: 50%-25%/2;
            top: 50%;
        }
    }
}
img {
    width: 10%;
}

.board-card-wrapper {
    display: flex;
}

.fade-enter-active {
    transition: all 0.4s ease;
}
.fade-enter {
    opacity: 0;
}
</style>
