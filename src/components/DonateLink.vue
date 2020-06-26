<template>
    <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
    >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="HSYA5RGHETQVN" />
        🍺
        <input
            type="submit"
            border="0"
            class="donate-link"
            name="submit"
            title="Děkuji za podporu!"
            value="Kup mi pivo na podporu vývoje!"
        />

        <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_CZ/i/scr/pixel.gif"
            width="1"
            height="1"
        />
        <small> (celkem zakoupeno: {{ beers }} 🍺)</small>
    </form>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
    computed: mapState(['beers']),
    methods: mapActions(['setBeers']),
    mounted() {
        axios({
            method: 'GET',
            url: 'https://desolate-beyond-09746.herokuapp.com/api/beers',
            headers: { crossDomain: true }
        }).then(response => {
            this.setBeers(response.data.beers)
        })
    }
})
</script>

<style lang="scss" scoped>
small {
    margin-top: 0.4em;
    display: block;
}
.donate-button {
    font-weight: bold;
    font-size: 0.9em;
    color: #2c3e50;
    padding: 0.6em 0.8em;
    background-color: rgba(107, 114, 9, 0.096);
    border: 2px solid #2c3e50;
    border-radius: 0.4em;
    cursor: pointer;
}

.donate-link {
    font-size: 1em;
    font-weight: bold;
    text-decoration: underline;
    border: none;
    cursor: pointer;
    color: #2c3e50;
    background-color: rgba(256, 256, 256, 0);
    padding: 0;
}
</style>
