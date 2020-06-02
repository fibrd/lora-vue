import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Results from '../views/Results.vue'
import Settings from '../views/Settings.vue'
import Records from '../views/Records.vue'

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
        component: Records
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
