<template>
    <div class="about">
        <h1>This is an about page</h1>
        <table>
            <tbody>
                <tr v-for="(points, index) in score" :key="index">
                    <th>{{ index + 1 }}.</th>
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
