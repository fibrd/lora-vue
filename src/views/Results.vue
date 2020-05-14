<template>
    <div class="results">
        <h1>Overall Results:</h1>
        <table>
            <tbody>
                <tr v-for="(points, index) in score" :key="index">
                    <th>Player{{ index + 1 }}:</th>
                    <td>{{ points }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
    computed: mapState(['score'])
})
</script>
