<template>
    <form>
        <select id="exam-select" @input="examPicked($event)">
            <option disabled selected value>
                -- Vyberte si hru --
            </option>
            <option
                v-for="n in gameModes.length"
                :key="n"
                :value="n - 1"
                :disabled="n === 3 && examAttempt !== 3"
            >
                {{ gameModes[n - 1] }}
            </option>
        </select>
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { general } from '@/modes/levelEasy'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
    computed: {
        ...mapState(['examAttempt']),
        gameModes() {
            return general.listOfGameModes
        }
    },
    methods: {
        ...mapActions(['setGame']),
        // eslint-disable-next-line
        examPicked(event: any) {
            this.setGame(event.target.value)
        }
    },
    watch: {
        examAttempt(value) {
            console.log(value)
        }
    }
})
</script>

<style scoped>
select#exam-select {
    position: relative;
    z-index: 10;
}
</style>
