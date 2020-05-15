<template>
    <div class="dif">
        <h1 class="text-center">Úroveň Obtížnosti:</h1>
        <form action="">
            <div>
                <label for="leveldifficult">Obtížné</label>
                <input type="radio" name="level" id="leveldifficult" />
            </div>
            <div>
                <label for="levelsemihard">Středně obtížné</label>
                <input type="radio" name="level" id="levelsemihard" />
            </div>
            <div>
                <label for="leveldifficult">Jednoduché</label>
                <input type="radio" name="level" id="leveleasy" />
            </div>
            <div>
                <label for="leveldifficult">Mazánek</label>
                <input type="radio" name="level" id="levelmazanek" />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
#app .text-center {
    text-align: center;
}
div {
    font-size: 1.1em;
    line-height: 1.4em;
}
</style>
