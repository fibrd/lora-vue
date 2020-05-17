<template>
    <div class="board-wrapper">
        <img
            v-cloak
            v-for="(boardCard, index) in sortedBoard"
            :key="boardCard.src + index"
            :src="boardCard.src"
            :class="{
                blank: isBlank(boardCard.src),
                highlighted: currentLoser === boardCard.sortId
            }"
            class="board-card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Card, BoardCard } from '@/types'

export default Vue.extend({
    props: {
        boardCards: Array as () => Card[],
        initPlayer: Number,
        currentLoser: Number
    },
    data() {
        return {
            srcBlank: './assets/cards/blank.png'
        }
    },
    computed: {
        sortedBoard() {
            const sortedBoard = [] as BoardCard[]

            // resorting actual board according to the initial player
            for (let i = 0; i < 4; i++) {
                const sortIndex = (i + this.initPlayer) % 4
                sortedBoard[sortIndex] = this.boardCards[i]
                    ? { src: this.boardCards[i].src, sortId: sortIndex }
                    : { src: this.srcBlank, sortId: sortIndex }
            }
            return sortedBoard
        }
    },
    methods: {
        isBlank(src: string): boolean {
            return src === this.srcBlank
        }
    }
})
</script>

<style lang="scss" scoped>
@function intendCard($cardWidth, $totalWidth, $margin: 0) {
    @return $totalWidth/2 - ($margin * 2 + $cardWidth)/2;
}

.board-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 22.5em;
    max-width: 22.5em;
    margin: 2em auto 6em;
}
.board-card {
    width: 6em;
    margin: 0.5em;
    &:nth-child(1) {
        display: flex;
        align-self: center;
    }
    &:nth-child(2) {
        display: flex;
        align-self: flex-start;
    }
    &:nth-child(3) {
        display: flex;
        align-self: center;
    }
    &:nth-child(4) {
        display: flex;
        align-self: flex-end;
        position: absolute;
        left: intendCard(800, 25, 100); // 22.5/2 - (2 * 0.5 +6) / 2;
    }
}

.blank {
    opacity: 0;
}

.highlighted {
    box-shadow: 0px 0px 4px 4px rgba(138, 7, 7, 0.6);
    z-index: 10;
}
.card {
    transition: box-shadow 1s ease;
}

.boarded-enter {
    opacity: 0;
}

.boarded-enter-active {
    transition: opacity 1s ease-in;
}

@media screen and (max-width: 780px) {
    .board-wrapper {
        min-height: 20em;
        margin-top: 0;
    }
    .board-card {
        width: 5em;
        &:nth-child(4) {
            left: 22.5/2 - (2 * 0.5 +5) em / 2em;
        }
    }
}
@media screen and (max-width: 460px) {
    .board-wrapper {
        min-height: 15em;
        margin-bottom: 6em;
    }
    .board-card {
        width: 4em;
        &:nth-child(4) {
            left: 22.5/2 - (2 * 0.5 +4) em / 2em;
        }
    }
}
</style>
