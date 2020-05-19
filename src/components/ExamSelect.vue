<template>
    <form>
        <select id="exam-select" @input="examPicked($event)">
            <option disabled selected value> -- Vyberte si hru -- </option>
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
import { mapActions } from 'vuex'

export default Vue.extend({
    props: {
        examAttempt: Number
    },
    data() {
        return {
            gameModes: general.listOfGameModes
        }
    },
    methods: {
        ...mapActions(['setGame']),
        // eslint-disable-next-line
        examPicked(event: any) {
            this.setGame(event.target.value)
        }
    }
})
</script>

<style scoped></style>
