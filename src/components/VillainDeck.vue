<template>
    <div class="card-wrapper">
        <h4 class="player-name">
            {{ villainsNames[villain] }}
        </h4>

        <img
            v-for="n in villainCards.length"
            :key="n"
            :src="cardBackSrc"
            alt="back"
            :class="{ highlighted: highlighted }"
            class="card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Card } from '@/types'

export default Vue.extend({
    props: {
        villainCards: Array as () => Card[],
        highlighted: Boolean,
        villain: Number
    },
    data() {
        return {
            cardBackSrc: './assets/cards/back.jpg'
        }
    },
    computed: {
        ...mapState(['villainsNames'])
    }
})
</script>

<style lang="scss" scoped>
.card {
    position: absolute;
    border: 1px currentColor solid;
    border-radius: 0.4em;
}
.player-name {
    position: absolute;
    top: -3.5em;
    z-index: 25;
}

.highlighted {
    box-shadow: 0px 0px 4px 4px rgba(37, 114, 1, 0.4);
}

@for $i from 1 through 8 {
    .card:nth-child(#{$i}) {
        transform-origin: 50% 120%;
        transform: rotateZ($i * 3deg - 12deg);
    }
}

.card-wrapper {
    display: flex;
    position: relative;
    justify-content: center;
    &:nth-child(1) {
        justify-content: left;
        top: 15em;
    }
    &:nth-child(3) {
        justify-content: right;
        top: 15em;
    }
}

.turned-enter-active,
.turned-leave-active {
    transition: opacity 0.4s ease;
}

.turned-enter,
.turned-leave-to {
    opacity: 0;
}

@media screen and (max-width: 780px) {
    .card {
        width: 14%;
        min-width: 4em;
        max-width: 5em;
        border-radius: 0.6em;
    }

    .card-wrapper {
        &:nth-child(1) {
            top: 5em;
        }
        &:nth-child(3) {
            top: 5em;
        }
    }
}
@media screen and (max-width: 460px) {
    .card {
        width: 15%;
        min-width: 3em;
    }
}
</style>
