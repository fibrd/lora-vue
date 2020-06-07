<template>
    <div class="records">
        <h1 class="text-center">Rekordy</h1>
        <div class="nav secondary-navigation">
            <router-link to="/records">Celkové</router-link> |
            <router-link to="/records-daily">Dnešní</router-link> |
            <router-link to="/records-weekly">Týdenní</router-link> |
            <router-link to="/records-monthly">Měsíční</router-link>
        </div>
        <router-view :key="$route.path" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapActions } from 'vuex'

export default Vue.extend({
    methods: {
        ...mapActions([
            'setRecords',
            'setRecordsDaily',
            'setRecordsWeekly',
            'setRecordsMonthly'
        ])
    },
    mounted() {
        axios({
            method: 'GET',
            url: 'https://desolate-beyond-09746.herokuapp.com/api/records',
            headers: { crossDomain: true }
        }).then(response => this.setRecords(response.data))

        axios({
            method: 'GET',
            url: 'https://desolate-beyond-09746.herokuapp.com/api/records/day',
            headers: { crossDomain: true }
        }).then(response => {
            console.log(response.data)
            this.setRecordsDaily(response.data)
        })

        axios({
            method: 'GET',
            url: 'https://desolate-beyond-09746.herokuapp.com/api/records/week',
            headers: { crossDomain: true }
        }).then(response => this.setRecordsWeekly(response.data))

        axios({
            method: 'GET',
            url:
                'https://desolate-beyond-09746.herokuapp.com/api/records/month',
            headers: { crossDomain: true }
        }).then(response => this.setRecordsMonthly(response.data))
    }
})
</script>

<style lang="scss">
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
    padding: 0.25em;
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

@media screen and (max-width: 560px) {
    table {
        font-size: 80%;
    }
}
</style>
