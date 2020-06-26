<template>
    <div class="records">
        <div class="nav secondary-navigation">
            <router-link to="/records/medium/all">Celkové</router-link> |
            <router-link to="/records/medium/daily">Dnešní</router-link> |
            <router-link to="/records/medium/weekly">Týdenní</router-link> |
            <router-link to="/records/medium/monthly">Měsíční</router-link>
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
        const urlEndpoint =
            'https://stormy-woodland-81750.herokuapp.com/api/records-medium'
        axios({
            method: 'GET',
            url: urlEndpoint,
            headers: { crossDomain: true }
        }).then(response => this.setRecords(response.data))

        axios({
            method: 'GET',
            url: urlEndpoint + '/day',
            headers: { crossDomain: true }
        }).then(response => {
            this.setRecordsDaily(response.data)
        })

        axios({
            method: 'GET',
            url: urlEndpoint + '/week',
            headers: { crossDomain: true }
        }).then(response => this.setRecordsWeekly(response.data))

        axios({
            method: 'GET',
            url: urlEndpoint + '/month',
            headers: { crossDomain: true }
        }).then(response => this.setRecordsMonthly(response.data))
    }
})
</script>

<style lang="scss"></style>
