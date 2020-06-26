<template>
    <div class="page-heading">
        <h4 class="current-game">
            {{ levelName }} úroveň | {{ thalia + 1 }}.&nbsp;tálie |
            {{ heroScore }}&nbsp;b. |
            <span>
                <strong v-show="examination">Maturita: </strong>&nbsp;{{
                    gameMode
                }}
            </span>
        </h4>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { general } from '../modes/levelEasy'

export default Vue.extend({
    computed: {
        ...mapState([
            'totalScore',
            'currentScore',
            'mode',
            'thalia',
            'examination',
            'level'
        ]),
        gameMode() {
            return general.gameMode()
        },
        heroScore() {
            return this.totalScore.length
                ? this.totalScore[this.totalScore.length - 1].score[3] +
                      this.currentScore[3]
                : 0
        },
        levelName() {
            return this.level === 'easy' ? 'Jednoduchá' : 'Střední'
        }
    }
})
</script>

<style lang="scss" scoped>
.page-heading {
    display: flex;
    justify-content: flex-start;
    h4 {
        margin-bottom: 0;
    }
}

.side-heading {
    justify-content: flex-end;
}

span {
    color: rgb(185, 24, 24);
}
</style>
