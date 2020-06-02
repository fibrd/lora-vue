<template>
    <div class="records">
        <h1 class="text-center">Rekordy</h1>
        <table class="table">
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
                <tr v-for="(record, index) in records" :key="record._id">
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
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/cs'
moment.locale('cs')
import { Record } from '@/types'

export default Vue.extend({
    data() {
        return {
            records: [] as Record[]
        }
    },
    methods: {
        formatDate(date: Date): string {
            const formattedDate = moment(date).fromNow()
            return formattedDate
        }
    },
    mounted() {
        axios({
            method: 'GET',
            url: 'https://desolate-beyond-09746.herokuapp.com/api/records',
            headers: { crossDomain: true }
        }).then(response => (this.records = response.data))
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
    min-width: 2em;
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
