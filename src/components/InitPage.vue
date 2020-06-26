<template>
    <div>
        <h1 class="text-center">Karetní hra Lóra</h1>
        <p class="game-details">
            Vítejte na stránce věnované webové aplikaci pro hraní populární
            kladenské karetní hry Lóra.
        </p>
        <p class="game-details">
            Podrobnosti o hře a její základní pravidla nalezenete na
            <a href="https://cs.wikipedia.org/wiki/L%C3%B3ra">Wikipedii</a>.
        </p>
        <h2>Spustit novou hru:</h2>

        <button @click="startEasyLevel">Úroveň Jednoduchá</button>
        <button @click="startMediumLevel">Úroveň Střední</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import axios from 'axios'

export default Vue.extend({
    methods: {
        ...mapActions(['startGame', 'setLevel']),
        startEasyLevel(): void {
            this.startGame()
            const urlEndpoint =
                'https://desolate-beyond-09746.herokuapp.com/api/attempts'
            axios({
                method: 'POST',
                url: urlEndpoint
            })
        },
        startMediumLevel(): void {
            this.setLevel('medium')
            this.startGame()
            const urlEndpoint =
                'https://stormy-woodland-81750.herokuapp.com/api/attempts'
            axios({
                method: 'POST',
                url: urlEndpoint
            })
        }
    }
})
</script>

<style lang="scss" scoped>
p {
    font-size: 1.2em;
    line-height: 1.4em;
    margin: 0.6em auto;
    max-width: 24em;
    padding: 0.4em;
}
h2 {
    margin-bottom: 0.6em;
}
</style>
