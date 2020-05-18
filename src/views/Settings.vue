<template>
    <div class="dif">
        <h1 class="text-center">Nastavení:</h1>
        <form class="settings-form">
            <div>
                <label for="nameInput">Jméno: </label>
                <input
                    v-model="name"
                    type="text"
                    id="nameInput"
                    maxlength="10"
                />
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
        </form>
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
    computed: mapState(['playerName', 'timeOut']),
    methods: {
        ...mapActions(['setPlayerName', 'setTimeOut']),
        // eslint-disable-next-line
        timeOutChanged(event: any): void {
            this.setTimeOut(event.target.value)
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
