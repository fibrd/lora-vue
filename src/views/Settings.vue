<template>
    <div class="dif">
        <h1 class="text-center">Nastavení:</h1>
        <form action="">
            <div>
                <label for="nameInput">Jméno: </label>
                <input
                    v-model="name"
                    type="text"
                    id="nameInput"
                    maxlength="10"
                />
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
    computed: mapState(['playerName']),
    methods: mapActions(['setPlayerName']),
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
