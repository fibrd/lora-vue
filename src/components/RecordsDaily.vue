<template>
    <div>
        <p v-if="!recordsDaily.length">Nenalezeny žádné záznamy.</p>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jméno</th>
                    <th>Body</th>
                    <th>Místo</th>
                    <th>Datum</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in recordsDaily" :key="record._id">
                    <td>{{ index + 1 }}.</td>
                    <td>{{ record.name }}</td>
                    <td>{{ record.points }}</td>
                    <td>{{ record.ranking }}</td>
                    <td>{{ formatDate(record.date) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { formatDate } from '@/utils'

export default Vue.extend({
    computed: mapState(['recordsDaily']),
    methods: {
        formatDate(date: Date): string {
            return formatDate(date)
        }
    }
})
</script>

<style scoped></style>
