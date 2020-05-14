<template>
    <div class="board-wrapper">
        <img
            v-for="(boardCard, index) in sortedBoard"
            :key="index"
            :src="boardCard.src"
            :class="{ blank: isBlank(boardCard.src) }"
            class="card board-card"
        />
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
    data() {
        return {
            srcBlank: './assets/cards/blank.jpg'
        }
    },
    computed: {
        sortedBoard() {
            const sortedBoard = [] as BoardCard[]

            // resorting actual board according to the initial player
            for (let i = 0; i < 4; i++) {
                const sortIndex = (i + this.initPlayer) % 4
                sortedBoard[sortIndex] = this.boardCards[i]
                    ? { src: this.boardCards[i].src }
                    : { src: this.srcBlank }
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
.board-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 25em;
    max-width: 22.5em;
    margin: 0 auto 6em;
}
.board-card {
    width: 25%;
    &:nth-child(2) {
        position: relative;
        top: -5em;
    }
    &:nth-child(4) {
        position: absolute;
        left: 50%-25%/2;
        top: 50%;
    }
}

.blank {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.4s ease;
}
.fade-enter {
    opacity: 0;
}

@media screen and (max-width: 780px) {
    .board-wrapper {
        min-height: 20em;
    }
    .board-card {
        width: 22%;
        &:nth-child(4) {
            left: 50%-22%/2;
            top: 45%;
        }
    }
}
@media screen and (max-width: 460px) {
    .board-wrapper {
        min-height: 14em;
        margin-bottom: 6em;
    }
    .board-card {
        width: 20%;
        &:nth-child(4) {
            left: 50%-20%/2;
            top: 45%;
        }
    }
}
</style>
