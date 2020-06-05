import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Results from '../views/Results.vue'
import Settings from '../views/Settings.vue'
import Records from '../views/Records.vue'
import RecordsAll from '../components/RecordsAll.vue'
import RecordsDaily from '../components/RecordsDaily.vue'
import RecordsWeekly from '../components/RecordsWeekly.vue'
import RecordsMonthly from '../components/RecordsMonthly.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
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
                path: '/records',
                name: 'RecordsAll',
                component: RecordsAll
            },
            {
                path: '/records-daily',
                name: 'RecordsDaily',
                component: RecordsDaily
            },
            {
                path: '/records-weekly',
                name: 'RecordsWeekly',
                component: RecordsWeekly
            },
            {
                path: '/records-monthly',
                name: 'RecordsMonthly',
                component: RecordsMonthly
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
