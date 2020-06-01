<template>
    <div class="card-wrapper">
        <div class="player-name">
            <h5>{{ villainsNames[villain] }} ({{ currentScore[villain] }})</h5>
        </div>
        <img
            v-for="n in playersCards[villain].length"
            :key="n"
            :src="cardBackSrc"
            alt="back"
            :class="{ highlighted: highlighted() }"
            class="card"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
    props: {
        villain: Number
    },
    data() {
        return {
            cardBackSrc: './assets/cards/back.png'
        }
    },
    computed: {
        ...mapState([
            'villainsNames',
            'initPlayer',
            'currentScore',
            'playersCards'
        ])
    },
    methods: {
        highlighted(): boolean {
            return this.villain === this.initPlayer
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    width: 4.5em;
    display: flex;
    position: absolute;
    border: 1px currentColor solid;
    border-radius: 0.4em;
    transition: box-shadow 1s ease;
}
.player-name {
    position: absolute;
    top: -2em;
    z-index: 5;

    h5,
    h6 {
        margin: 0;
    }
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

.card-name {
    position: relative;
    top: -150px;
    right: 50px;
    font-size: 1.2em;
}

.card-wrapper {
    display: flex;
    position: relative;
    justify-content: center;
    &:nth-child(1) {
        justify-content: flex-start;
        top: 12em;
    }
    &:nth-child(3) {
        justify-content: flex-end;
        top: 12em;
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

@media screen and (max-width: 768px) {
    .card {
        width: 4em;
    }
    .card-wrapper {
        &:nth-child(1) {
            top: 6em;
        }
        &:nth-child(3) {
            top: 6em;
        }
    }
}
@media screen and (max-width: 520px) {
    .card {
        width: 3.4em;
    }
    .card-wrapper {
        &:nth-child(1),
        &:nth-child(3) {
            top: 4em;
        }
    }
}
</style>
