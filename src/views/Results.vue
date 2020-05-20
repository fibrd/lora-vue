<template>
    <div class="table-container">
        <table v-show="totalScore[0]" class="table">
            <thead>
                <tr>
                    <th>Typ hry</th>
                    <th v-for="n in 3" :key="n">
                        {{ villainsNames[n - 1] }}
                    </th>
                    <th>{{ playerName }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(mode, index) in listModes" :key="index">
                    <td v-show="totalScore[index]">{{ mode }}</td>
                    <td
                        v-for="(points, i) in totalScore[index]"
                        :key="i"
                        class="td-points"
                    >
                        {{ points }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { general } from '@/modes'

export default Vue.extend({
    computed: {
        ...mapState(['totalScore', 'playerName', 'villainsNames']),
        listModes() {
            return [
                ...general.listOfGameModes,
                ...general.listOfGameModes,
                ...general.listOfGameModes,
                ...general.listOfGameModes
            ]
        }
    }
})
</script>

<style lang="scss" scoped>
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

@media screen and (max-width: 460px) {
    table {
        font-size: 80%;
    }
}
</style>
