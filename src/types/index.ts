export interface Card {
    id: number
    src: string
    name: string
    value: number
    flush: number
}

export interface BoardCard {
    src: string
    sortId: number
}

export interface TotalScore {
    gameMode: string
    score: number[]
}

export interface Record {
    __v: number
    _id: string
    name: string
    points: number
    ranking: number
}
