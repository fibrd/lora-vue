<template>
    <div class="records">
        <div class="nav secondary-navigation">
            <h2>Rekordy</h2>
            <router-link to="/records/easy">Jednoduché</router-link> |
            <router-link to="/records/medium">Střední</router-link>
        </div>
        <router-view :key="$route.path" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
    methods: {
        ...mapActions([
            'setRecords',
            'setRecordsDaily',
            'setRecordsWeekly',
            'setRecordsMonthly'
        ])
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
