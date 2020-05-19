import { Card } from '../types'

const state = {
    cards: [
        {
            id: 1,
            src: './assets/cards/7_c.png',
            name: '7c',
            value: 0,
            flush: 0
        },
        {
            id: 2,
            src: './assets/cards/8_c.png',
            name: '8c',
            value: 1,
            flush: 0
        },
        {
            id: 3,
            src: './assets/cards/9_c.png',
            name: '9c',
            value: 2,
            flush: 0
        },
        {
            id: 4,
            src: './assets/cards/t_c.png',
            name: 'tc',
            value: 3,
            flush: 0
        },
        {
            id: 5,
            src: './assets/cards/j_c.png',
            name: 'jc',
            value: 4,
            flush: 0
        },
        {
            id: 6,
            src: './assets/cards/q_c.png',
            name: 'qc',
            value: 5,
            flush: 0
        },
        {
            id: 7,
            src: './assets/cards/k_c.png',
            name: 'kc',
            value: 6,
            flush: 0
        },
        {
            id: 8,
            src: './assets/cards/a_c.png',
            name: 'ac',
            value: 7,
            flush: 0
        },
        {
            id: 9,
            src: './assets/cards/7_s.png',
            name: '7s',
            value: 0,
            flush: 1
        },
        {
            id: 10,
            src: './assets/cards/8_s.png',
            name: '8s',
            value: 1,
            flush: 1
        },
        {
            id: 11,
            src: './assets/cards/9_s.png',
            name: '9s',
            value: 2,
            flush: 1
        },
        {
            id: 12,
            src: './assets/cards/t_s.png',
            name: 'ts',
            value: 3,
            flush: 1
        },
        {
            id: 13,
            src: './assets/cards/j_s.png',
            name: 'js',
            value: 4,
            flush: 1
        },
        {
            id: 14,
            src: './assets/cards/q_s.png',
            name: 'qs',
            value: 5,
            flush: 1
        },
        {
            id: 15,
            src: './assets/cards/k_s.png',
            name: 'ks',
            value: 6,
            flush: 1
        },
        {
            id: 16,
            src: './assets/cards/a_s.png',
            name: 'as',
            value: 7,
            flush: 1
        },
        {
            id: 17,
            src: './assets/cards/7_d.png',
            name: '7d',
            value: 0,
            flush: 2
        },
        {
            id: 18,
            src: './assets/cards/8_d.png',
            name: '8d',
            value: 1,
            flush: 2
        },
        {
            id: 19,
            src: './assets/cards/9_d.png',
            name: '9d',
            value: 2,
            flush: 2
        },
        {
            id: 20,
            src: './assets/cards/t_d.png',
            name: 'td',
            value: 3,
            flush: 2
        },
        {
            id: 21,
            src: './assets/cards/j_d.png',
            name: 'jd',
            value: 4,
            flush: 2
        },
        {
            id: 22,
            src: './assets/cards/q_d.png',
            name: 'qd',
            value: 5,
            flush: 2
        },
        {
            id: 23,
            src: './assets/cards/k_d.png',
            name: 'kd',
            value: 6,
            flush: 2
        },
        {
            id: 24,
            src: './assets/cards/a_d.png',
            name: 'ad',
            value: 7,
            flush: 2
        },
        {
            id: 25,
            src: './assets/cards/7_h.png',
            name: '7h',
            value: 0,
            flush: 3
        },
        {
            id: 26,
            src: './assets/cards/8_h.png',
            name: '8h',
            value: 1,
            flush: 3
        },
        {
            id: 27,
            src: './assets/cards/9_h.png',
            name: '9h',
            value: 2,
            flush: 3
        },
        {
            id: 28,
            src: './assets/cards/t_h.png',
            name: 'th',
            value: 3,
            flush: 3
        },
        {
            id: 29,
            src: './assets/cards/j_h.png',
            name: 'jh',
            value: 4,
            flush: 3
        },
        {
            id: 30,
            src: './assets/cards/q_h.png',
            name: 'qh',
            value: 5,
            flush: 3
        },
        {
            id: 31,
            src: './assets/cards/k_h.png',
            name: 'kh',
            value: 6,
            flush: 3
        },
        {
            id: 32,
            src: './assets/cards/a_h.png',
            name: 'ah',
            value: 7,
            flush: 3
        }
    ] as Card[],
    villainsNames: [] as string[],
    playerName: 'Hero',
    mode: 0,
    timeOut: 2000,
    score: [0, 0, 0, 0],
    examination: false,
    thalia: 0,
    gameIsOver: false
}

export default state
