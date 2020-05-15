<template>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(points, index) in currentScore" :key="index">
                    <td v-if="index === 3">Hero</td>
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
    computed: mapState(['score', 'villainsNames'])
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
}
thead {
    text-align: center;
}

.table {
    border: 1px solid black;
    padding: 0.4em 0.2em;
}
</style>
