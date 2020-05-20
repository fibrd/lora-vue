import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Results from '../views/Results.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Results',
        component: Results
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
