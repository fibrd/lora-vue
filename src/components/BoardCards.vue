<template>
    <div class="board-wrapper">
        <img
            v-cloak
            v-for="(boardCard, index) in sortedBoard"
            :key="boardCard.src + index"
            :src="boardCard.src"
            :class="{
                blank: isBlank(boardCard.src),
                highlighted: isHighlighted(index)
            }"
            class="board-card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
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
        ...mapState(['mode']),
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
        },
        isHighlighted(index: number): boolean {
            return index === this.currentLoser && this.mode !== 5
        }
    }
})
</script>

<style lang="scss" scoped>
@function intend-card($totalWidth, $cardWidth, $margin: 0) {
    @return ($totalWidth / 2 - ((2 * $margin + $cardWidth)/2)) * 1em;
}

.board-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 18em;
    max-width: 18em;
    margin: 1em auto 4em;
}

.board-card {
    display: flex;
    width: 5em;
    margin: 0.5em;
    &:nth-child(1) {
        align-self: center;
    }
    &:nth-child(2) {
        align-self: flex-start;
    }
    &:nth-child(3) {
        align-self: center;
    }
    &:nth-child(4) {
        align-self: flex-end;
        position: absolute;
        left: intend-card(18, 5, 0.5);
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

@media screen and (max-width: 768px) {
    .board-wrapper {
        margin-bottom: 3em;
        min-height: 18em;
        top: -0.5em;
    }
}
@media screen and (max-width: 460px) {
    .board-wrapper {
        min-height: 12em;
        width: 12em;
        position: relative;
        top: -3em;
        margin-bottom: 0em;
    }
    .board-card {
        margin: 0.2em;
        width: 3.5em;
        &:nth-child(1),
        &:nth-child(3) {
            align-self: flex-end;
        }
        &:nth-child(4) {
            z-index: 100;
            left: intend-card(12, 3.5, 0.2);
        }
    }
}
</style>
