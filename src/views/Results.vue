<template>
    <div class="table-container" v-if="totalScore.length">
        <form
            @submit.prevent="saveRecord"
            v-if="gameIsOver && !recordSubmitted"
        >
            <label for="inputName">Zadejte své jméno: </label>
            <input
                type="text"
                id="inputName"
                ref="inputName"
                minlength="3"
                maxlength="12"
                :value="playerName"
            />
            <input type="submit" value="Uložit výsledek" />
        </form>
        <table class="table">
            <thead>
                <tr>
                    <th>Pořadí</th>
                    <th v-for="(rank, index) in ranking" :key="index">
                        {{ rank }}.
                    </th>
                </tr>
                <tr>
                    <th>Body</th>
                    <th v-for="(points, index) in currentScore" :key="index">
                        {{ points }}
                    </th>
                </tr>
                <tr>
                    <th>Jméno</th>
                    <th v-for="n in 3" :key="n">
                        {{ villainsNames[n - 1] }}
                    </th>
                    <th>{{ playerName }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in totalScore" :key="index">
                    <td>{{ item.mode }}</td>
                    <td v-for="(points, index) in item.score" :key="index">
                        {{ points }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapState } from 'vuex'
import { sortBy } from 'lodash-es'
import { general } from '@/modes'

export default Vue.extend({
    computed: {
        ...mapState([
            'totalScore',
            'playerName',
            'villainsNames',
            'gameIsOver',
            'recordSubmitted'
        ]),
        listModes() {
            return [
                ...general.listOfGameModes,
                'Maturita I',
                'Maturita II',
                'Maturita III',
                ...general.listOfGameModes,
                'Maturita I',
                'Maturita II',
                'Maturita III',
                ...general.listOfGameModes,
                'Maturita I',
                'Maturita II',
                'Maturita III',
                ...general.listOfGameModes,
                'Maturita I',
                'Maturita II',
                'Maturita III'
            ]
        },
        currentScore(): number[] {
            return this.totalScore[this.totalScore.length - 1].score
        },
        ranking(): number[] {
            const currentScore = this.currentScore as number[]
            const sortedScore = sortBy(currentScore)
            const rank = currentScore.map(
                p => sortedScore.findIndex(points => points === p) + 1
            )
            return rank
        }
    },
    methods: {
        saveRecord(): void {
            this.$store.dispatch('submitRecord')
            const input = this.$refs.inputName as HTMLInputElement
            const points = this.currentScore[3]
            const ranking = this.ranking[3]
            const bodyData = {
                name: input.value,
                points,
                ranking
            }
            axios({
                method: 'POST',
                url: 'https://desolate-beyond-09746.herokuapp.com/api/records',
                data: bodyData
            })
                .then(() =>
                    window.alert(
                        'Záznam byl úspěšně uložen do databáze. Děkujeme za hru!'
                    )
                )
                .catch(err => {
                    window.alert(
                        'Vznikla nespecifikovaná chyba při pokusu o uložení záznamu.'
                    )
                    console.error(err)
                })
        }
    }
})
</script>

<style lang="scss" scoped>
#app .text-center {
    text-align: center;
}

table {
    border-collapse: collapse;
    width: 100%;
    max-width: 30em;
    margin: 2em auto;
}
th,
td {
    padding: 0.25rem;
    text-align: left;
    border: 1px solid #ccc;
    text-align: center;
    min-width: 4em;
}
.td-points {
    text-align: center;
}
tbody tr:nth-child(odd) {
    background: #eee;
}

@media screen and (max-width: 520px) {
    table {
        font-size: 80%;
    }
}
</style>
