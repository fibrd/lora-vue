<template>
    <div class="button-container">
        <div class="button-wrapper">
            <a href="#top" @click.prevent="$emit('giveUp')" v-show="mode < 5">
                Zahodit karty
            </a>
            <a
                href="#top"
                class="button-tens"
                @click.prevent="$emit('tensNext')"
                v-show="isTens && tensPlayed"
            >
                Další hráč
            </a>
            <a
                href="#top"
                class="button-tens"
                @click.prevent="$emit('heroKnock')"
                v-show="isTens && !tensPlayed"
            >
                Ťuk
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
    computed: {
        ...mapState(['mode', 'tensPlayed', 'isFinished']),
        isTens() {
            return this.mode === 6
        }
    }
})
</script>

<style lang="scss" scoped>
.button {
    box-shadow: inset 0px 1px 0px 0px #ffffff;
    background-color: #f9f9f9;
    border-radius: 6px;
    border: 1px solid currentColor;
    display: inline-block;
    cursor: pointer;
    //color: #666666;
    //font-family: Arial;
    font-weight: bold;
    padding: 0.4em0.6em;
    margin-bottom: 0.4em;
    text-decoration: none;
    text-shadow: 0px 1px 0px #ffffff;
}
.button:hover {
    background-color: #e9e9e9;
}
.button:active {
    position: relative;
    top: 1px;
}

.button-container {
    width: 95%;
    white-space: nowrap;
    margin: 0 auto;
    max-width: 50em;
    display: flex;
    position: relative;
    justify-content: flex-end;
    font-size: 0.8em;
    z-index: 9;

    a {
        font-weight: bold;
        color: #2c3e50;
    }
}

a.button-tens {
    position: relative;
    top: -0.2em;
    font-size: 1.3em;
    padding: 0.4em;
    color: rgb(185, 24, 24);
}

.button-wrapper {
    position: absolute;
    top: -2em;
}
</style>
