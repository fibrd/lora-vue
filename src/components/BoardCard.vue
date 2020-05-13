<template>
    <transition-group tag="div" name="fade" class="board" mode="out-in" appear>
        <img
            v-for="card in boardCards"
            :key="card.id"
            :src="card.src"
            alt="actual card"
        />
    </transition-group>
    <!-- <div class="board-wrapper">
        <img :src="boardCards[0].src" alt="board card 1" class="board-card" />

        <img :src="boardCards[1].src" alt="board card 2" class="board-card" />

        <img :src="boardCards[2].src" alt="board card 3" class="board-card" />

        <img :src="boardCards[3].src" alt="board card 4" class="board-card" />
    </div> -->
</template>

<script lang="ts">
import Vue from 'vue'
import { Card } from '@/types'
import { sortBy } from 'lodash-es'

export default Vue.extend({
    props: {
        boardCards: Array as () => Card[],
        initPlayer: Number
    },
    computed: {
        // resorting actual board according to the initial player
        sortedBoard() {
            // let sortedBoard = this.boardCards
            // for (let i = 0; i < 4; i++) {
            //     const element = array[i];

            // }
            let sortedBoard = [] as {}[]
            sortedBoard.fill({}, 0, 4)
            sortedBoard = this.boardCards.map((card, index) => {
                const marginIndex = (4 - index) % 4
                return { src: card.src, sortId: marginIndex }
            })
            return sortBy(sortedBoard, ['sortId'])
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
