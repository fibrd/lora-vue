<template>
    <div class="records">
        <div class="nav secondary-navigation">
            <router-link to="/records/easy/all">Celkové</router-link> |
            <router-link to="/records/easy/daily">Dnešní</router-link> |
            <router-link to="/records/easy/weekly">Týdenní</router-link> |
            <router-link to="/records/easy/monthly">Měsíční</router-link>
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
            'https://desolate-beyond-09746.herokuapp.com/api/records'
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
