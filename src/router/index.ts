import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Results from '../views/Results.vue'
import Settings from '../views/Settings.vue'
import Records from '../views/Records.vue'
import RecordsEasy from '../views/RecordsEasy.vue'
import RecordsMedium from '../views/RecordsMedium.vue'
import RecordsAll from '../components/RecordsAll.vue'
import RecordsDaily from '../components/RecordsDaily.vue'
import RecordsWeekly from '../components/RecordsWeekly.vue'
import RecordsMonthly from '../components/RecordsMonthly.vue'
import RecordsAllMedium from '../components/RecordsAllMedium.vue'
import RecordsDailyMedium from '../components/RecordsDailyMedium.vue'
import RecordsWeeklyMedium from '../components/RecordsWeeklyMedium.vue'
import RecordsMonthlyMedium from '../components/RecordsMonthlyMedium.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/results',
        name: 'Results',
        component: Results
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/records',
        name: 'Records',
        component: Records,
        children: [
            {
                path: '/records/easy',
                name: 'RecordsEasy',
                component: RecordsEasy,
                children: [
                    {
                        path: '/records/easy/all',
                        name: 'RecordsAll',
                        component: RecordsAll
                    },
                    {
                        path: '/records/easy/daily',
                        name: 'RecordsDaily',
                        component: RecordsDaily
                    },
                    {
                        path: '/records/easy/weekly',
                        name: 'RecordsWeekly',
                        component: RecordsWeekly
                    },
                    {
                        path: '/records/easy/monthly',
                        name: 'RecordsMonthly',
                        component: RecordsMonthly
                    }
                ]
            },
            {
                path: '/records/medium',
                name: 'RecordsMedium',
                component: RecordsMedium,
                children: [
                    {
                        path: '/records/medium/all',
                        name: 'RecordsAllMedium',
                        component: RecordsAllMedium
                    },
                    {
                        path: '/records/medium/daily',
                        name: 'RecordsDailyMedium',
                        component: RecordsDailyMedium
                    },
                    {
                        path: '/records/medium/weekly',
                        name: 'RecordsWeeklyMedium',
                        component: RecordsWeeklyMedium
                    },
                    {
                        path: '/records/medium/monthly',
                        name: 'RecordsMonthlyMedium',
                        component: RecordsMonthlyMedium
                    }
                ]
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
