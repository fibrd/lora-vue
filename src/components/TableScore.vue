<template>
    <div class="table-container">
        <table class="table">
            <tbody>
                <tr v-for="(points, index) in currentScore" :key="index">
                    <td v-if="index === 3">
                        <strong>{{ playerName }}</strong>
                    </td>
                    <td v-else>{{ villainsNames[index] }}</td>
                    <td>{{ points }}</td>
                    <td>{{ score[index] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
    props: {
        currentScore: Array
    },
    computed: mapState(['score', 'playerName', 'villainsNames'])
})
</script>

<style scoped>
.table-container {
    display: flex;
    justify-content: flex-end;
}
.table {
    position: fixed;
    z-index: 20;
    border-collapse: collapse;
    text-align: left;
    background-color: inherit;
}
td {
    text-align: center;
}

.table,
td {
    border: 1px solid black;
    padding: 0.2em 0.4em;
}
</style>
