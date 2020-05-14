import { Card } from '../types'

const state = {
    cards: [
        {
            id: 1,
            src: './assets/cards/7_c.jpg',
            name: '7c',
            value: 0,
            flush: 0
        },
        {
            id: 2,
            src: './assets/cards/8_c.jpg',
            name: '8c',
            value: 1,
            flush: 0
        },
        {
            id: 3,
            src: './assets/cards/9_c.jpg',
            name: '9c',
            value: 2,
            flush: 0
        },
        {
            id: 4,
            src: './assets/cards/t_c.jpg',
            name: 'tc',
            value: 3,
            flush: 0
        },
        {
            id: 5,
            src: './assets/cards/j_c.jpg',
            name: 'jc',
            value: 4,
            flush: 0
        },
        {
            id: 6,
            src: './assets/cards/q_c.jpg',
            name: 'qc',
            value: 5,
            flush: 0
        },
        {
            id: 7,
            src: './assets/cards/k_c.jpg',
            name: 'kc',
            value: 6,
            flush: 0
        },
        {
            id: 8,
            src: './assets/cards/a_c.jpg',
            name: 'ac',
            value: 7,
            flush: 0
        },
        {
            id: 9,
            src: './assets/cards/7_s.jpg',
            name: '7s',
            value: 0,
            flush: 1
        },
        {
            id: 10,
            src: './assets/cards/8_s.jpg',
            name: '8s',
            value: 1,
            flush: 1
        },
        {
            id: 11,
            src: './assets/cards/9_s.jpg',
            name: '9s',
            value: 2,
            flush: 1
        },
        {
            id: 12,
            src: './assets/cards/t_s.jpg',
            name: 'ts',
            value: 3,
            flush: 1
        },
        {
            id: 13,
            src: './assets/cards/j_s.jpg',
            name: 'js',
            value: 4,
            flush: 1
        },
        {
            id: 14,
            src: './assets/cards/q_s.jpg',
            name: 'qs',
            value: 5,
            flush: 1
        },
        {
            id: 15,
            src: './assets/cards/k_s.jpg',
            name: 'ks',
            value: 6,
            flush: 1
        },
        {
            id: 16,
            src: './assets/cards/a_s.jpg',
            name: 'as',
            value: 7,
            flush: 1
        },
        {
            id: 17,
            src: './assets/cards/7_d.jpg',
            name: '7d',
            value: 0,
            flush: 2
        },
        {
            id: 18,
            src: './assets/cards/8_d.jpg',
            name: '8d',
            value: 1,
            flush: 2
        },
        {
            id: 19,
            src: './assets/cards/9_d.jpg',
            name: '9d',
            value: 2,
            flush: 2
        },
        {
            id: 20,
            src: './assets/cards/t_d.jpg',
            name: 'td',
            value: 3,
            flush: 2
        },
        {
            id: 21,
            src: './assets/cards/j_d.jpg',
            name: 'jd',
            value: 4,
            flush: 2
        },
        {
            id: 22,
            src: './assets/cards/q_d.jpg',
            name: 'qd',
            value: 5,
            flush: 2
        },
        {
            id: 23,
            src: './assets/cards/k_d.jpg',
            name: 'kd',
            value: 6,
            flush: 2
        },
        {
            id: 24,
            src: './assets/cards/a_d.jpg',
            name: 'ad',
            value: 7,
            flush: 2
        },
        {
            id: 25,
            src: './assets/cards/7_h.jpg',
            name: '7h',
            value: 0,
            flush: 3
        },
        {
            id: 26,
            src: './assets/cards/8_h.jpg',
            name: '8h',
            value: 1,
            flush: 3
        },
        {
            id: 27,
            src: './assets/cards/9_h.jpg',
            name: '9h',
            value: 2,
            flush: 3
        },
        {
            id: 28,
            src: './assets/cards/t_h.jpg',
            name: 'th',
            value: 3,
            flush: 3
        },
        {
            id: 29,
            src: './assets/cards/j_h.jpg',
            name: 'jh',
            value: 4,
            flush: 3
        },
        {
            id: 30,
            src: './assets/cards/q_h.jpg',
            name: 'qh',
            value: 5,
            flush: 3
        },
        {
            id: 31,
            src: './assets/cards/k_h.jpg',
            name: 'kh',
            value: 6,
            flush: 3
        },
        {
            id: 32,
            src: './assets/cards/a_h.jpg',
            name: 'ah',
            value: 7,
            flush: 3
        }
    ] as Card[],
    mode: 0,
    timeOut: 2000,
    score: [0, 0, 0, 0]
}

export default state
