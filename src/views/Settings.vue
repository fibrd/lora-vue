<template>
    <div class="dif">
        <h1 class="text-center">Nastavení</h1>

        <div>
            <label for="nameInput">Jméno: </label>
            <input v-model="name" type="text" id="nameInput" maxlength="10" />
        </div>
        <div>
            <label for="timeOut">Čas odezvy: </label>
            <select id="timeOut" @change="timeOutChanged($event)">
                <option
                    v-for="n in 3"
                    :key="n"
                    :value="n * 1000"
                    :selected="+timeOut === n * 1000"
                >
                    {{ n }}s
                </option>
            </select>
        </div>
        <div>
            <label for="sortingCards">Seřadit karty: </label>
            <select id="sortingCards" @change="sortingCardsChanged($event)">
                <option :value="true">ano</option>
                <option :value="false" :selected="!sortingCards">ne</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
    data() {
        return {
            name: ''
        }
    },
    computed: mapState(['playerName', 'timeOut', 'sortingCards']),
    methods: {
        ...mapActions(['setPlayerName', 'setTimeOut', 'setSortingCards']),
        // eslint-disable-next-line
        timeOutChanged(event: any): void {
            this.setTimeOut(event.target.value)
        },
        // eslint-disable-next-line
        sortingCardsChanged(event: any): void {
            this.setSortingCards(JSON.parse(event.target.value))
        }
    },
    watch: {
        name(value) {
            if (this.playerName !== value) {
                this.setPlayerName(value)
            }
        }
    },
    created() {
        this.name = this.playerName
    }
})
</script>

<style lang="scss" scoped>
#app .text-center {
    text-align: center;
}
div {
    font-size: 1.1em;
    line-height: 1.4em;
}
</style>
