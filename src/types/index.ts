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
