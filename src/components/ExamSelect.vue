<template>
    <form>
        <select id="exam-select" @input="$emit('examPicked', $event)">
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
import { general } from '@/modes'
import { mapState } from 'vuex'

export default Vue.extend({
    computed: {
        ...mapState(['examAttempt']),
        gameModes() {
            return general.listOfGameModes
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
