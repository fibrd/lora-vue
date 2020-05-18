import { Card } from '@/types'
import store from '@/store'

/**
 * GAME MODE HEARTS
 */
export const hearts = {
    // checks if hero can init hearts
    canInitHeart(card: Card, heroCards: Card[]): boolean {
        const anyNotHeart = heroCards.find(c => c.flush !== 3)
        return card.flush !== 3 || !anyNotHeart
    },

    // count current score
    score(boardCards: Card[], currentLoser: number): number[] {
        const score = [0, 0, 0, 0]
        score[currentLoser] += boardCards.filter(
            card => card.flush === 3
        ).length
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const anyNotHearts = sortedDeck.filter(card => card.flush !== 3)
        return anyNotHearts.length ? anyNotHearts[0] : sortedDeck[0]
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(
        cards: Card[],
        eligeableCards: Card[],
        initCard: Card
    ): Card[] {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : cards[cards.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return [currentCard]
    }
}

/**
 * GAME MODE QUEENS
 */
export const queens = {
    // count current score
    score(boardCards: Card[], currentLoser: number): number[] {
        const score = [0, 0, 0, 0]
        score[currentLoser] +=
            boardCards.filter(card => card.value === 5).length * 2
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        return sortedDeck[0]
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(
        sortedDeck: Card[],
        eligeableCards: Card[],
        initCard: Card
    ): Card[] {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return [currentCard]
    }
}

/**
 * GAME MODE FILA
 */
export const fila = {
    // count current score
    score(heroCards: number, currentLoser: number): number[] {
        const score = [0, 0, 0, 0]
        score[currentLoser] += heroCards === 7 || heroCards === 0 ? 4 : 0
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        return sortedDeck[0]
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(
        sortedDeck: Card[],
        eligeableCards: Card[],
        initCard: Card
    ): Card[] {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return [currentCard]
    }
}

/**
 * GAME MODE ANY
 */
export const any = {
    // count current score
    score(boardCards: Card[], currentLoser: number): number[] {
        const score = [0, 0, 0, 0]
        score[currentLoser] += 1
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        return sortedDeck[0]
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(
        sortedDeck: Card[],
        eligeableCards: Card[],
        initCard: Card
    ): Card[] {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return [currentCard]
    }
}

/**
 * GAME MODE KING
 */
export const king = {
    // count current score
    score(boardCards: Card[], currentLoser: number): number[] {
        const score = [0, 0, 0, 0]
        score[currentLoser] +=
            boardCards.filter(card => card.id === 31).length * 8
        return score
    },

    // checks if hero can init hearts
    canInitHeart(card: Card, heroCards: Card[]): boolean {
        const anyNotHeart = heroCards.find(c => c.flush !== 3)
        return card.flush !== 3 || !anyNotHeart
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const anyNotHearts = sortedDeck.filter(card => card.flush !== 3)
        return anyNotHearts.length ? anyNotHearts[0] : sortedDeck[0]
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(
        sortedDeck: Card[],
        eligeableCards: Card[],
        initCard: Card
    ): Card[] {
        sortedDeck =
            sortedDeck.length === 8
                ? sortedDeck.filter(c => c.id !== 31)
                : sortedDeck
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return [currentCard]
    }
}

/**
 * GAME MODE QUARTERS
 */
export const quarters = {
    // count current score
    score(playersCards: Card[][]): number[] {
        const score = playersCards.map(player => player.length)
        return score
    },

    canPlayCard(card: Card, initCard: Card): boolean {
        console.log(initCard, card)
        return card.value - initCard.value <= 3 && card.flush === initCard.flush
    },

    villainTurn(playerCards: Card[], initCard: Card): Card[] {
        const eligeableCards = playerCards.filter(card =>
            this.canPlayCard(card, initCard)
        )
        return eligeableCards
    },

    // noEligeableCard(cards: Card[], playedCards: Card[]): boolean {
    //     const eligeableCards = cards.filter(card =>
    //         this.canPlayCard(card, playedCards)
    //     )
    //     return eligeableCards.length === 0
    // },

    isOver(playersCards: Card[][]): boolean {
        const anyoneWithNoCards = playersCards.find(
            player => player.length === 0
        )
        return anyoneWithNoCards !== undefined
    }
}

/**
 * GAME MODE TENS
 */
export const tens = {
    // cards array for initializing this game mode
    initCards: store.state.cards.map(c => {
        return { ...c, src: './assets/cards/blank.png' }
    }) as Card[],

    // count current score
    score(playersCards: Card[][]): number[] {
        const score = playersCards.map(player => player.length)
        return score
    },

    canPlayCard(card: Card, playedCards: Card[]): boolean {
        let canPlayCard = false
        // if card is ten and ten only
        if (card.value === 3) canPlayCard = true
        // lower card than ten must have its higher neighbour
        else if (card.value < 3) {
            canPlayCard =
                playedCards.find(c => c.id === card.id + 1) !== undefined
            // higher card than ten must have its lower neighbour
        } else {
            canPlayCard =
                playedCards.find(c => c.id === card.id - 1) !== undefined
        }
        return canPlayCard
    },

    villainTurn(playerCards: Card[], playedCards: Card[]): Card[] {
        const eligeableCards = playerCards.filter(card =>
            this.canPlayCard(card, playedCards)
        )
        return eligeableCards
    },

    noEligeableCard(cards: Card[], playedCards: Card[]): boolean {
        const eligeableCards = cards.filter(card =>
            this.canPlayCard(card, playedCards)
        )
        return eligeableCards.length === 0
    },

    knock(player: number): void {
        store.dispatch
    },

    isOver(playersCards: Card[][]): boolean {
        const anyoneWithNoCards = playersCards.find(
            player => player.length === 0
        )
        return anyoneWithNoCards !== undefined
    }
}

/**
 * GENERAL RULES FOR MORE GAME MODES
 */
export const general = {
    // list of all game modes
    listOfGameModes: [
        'Červený',
        'Filky',
        'PrPo',
        'Všechny',
        'Bedrník',
        'Kvarty',
        'Desítky'
    ],

    gameMode(): string {
        let name = ''
        switch (store.state.mode) {
            case 0:
                name = 'Červený'
                break
            case 1:
                name = 'Filky'
                break
            case 2:
                name = 'PrPo'
                break
            case 4:
                name = 'Bedrník'
                break
            case 5:
                name = 'Kvarty'
                break
            case 6:
                name = 'Desítky'
                break
            case 7:
                name = 'Maturita'
                break
            default:
                name = 'Všechny'
                break
        }
        return name
    },

    // list of all possible players names
    listOfNames: [
        'Adam',
        'Aleš',
        'Antonín',
        'Daniel',
        'David',
        'Filip',
        'František',
        'Ivo',
        'Jakub',
        'Jan',
        'Jaromír',
        'Jaroslav',
        'Jindřich',
        'Jiří',
        'Josef',
        'Kamil',
        'Karel',
        'Ladislav',
        'Libor',
        'Lubomír',
        'Luboš',
        'Luděk',
        'Lukáš',
        'Marek',
        'Martin',
        'Michal',
        'Milan',
        'Miroslav',
        'Oldřich',
        'Ondřej',
        'Patrik',
        'Pavel',
        'Petr',
        'Radek',
        'Radim',
        'Richard',
        'Robert',
        'Roman',
        'Stanislav',
        'Štěpán',
        'Tomáš',
        'Václav',
        'Viktor',
        'Vladimír',
        'Vlastimil',
        'Vojtěch',
        'Zdeněk',
        'Alan',
        'Alexandr',
        'Bedřich',
        'Bohdan',
        'Bohumil',
        'Bohumír',
        'Bohuslav',
        'Boris',
        'Bořivoj',
        'Břetislav',
        'Čeněk',
        'Dalibor',
        'Dan',
        'Dominik',
        'Drahomír',
        'Dušan',
        'Emil',
        'Erik',
        'Evžen',
        'Gustav',
        'Hynek',
        'Igor',
        'Ivan',
        'Julius',
        'Kryštof',
        'Leoš',
        'Lubor',
        'Ludvík',
        'Lumír',
        'Marcel',
        'Marián',
        'Matěj',
        'Miloslav',
        'Miloš',
        'Mirek',
        'Mojmír',
        'Nikola',
        'Ota',
        'Otakar',
        'Přemysl',
        'Radomír',
        'Radoslav',
        'Radovan',
        'René',
        'Robin',
        'Rostislav',
        'Rudolf',
        'Svatopluk',
        'Šimon',
        'Tibor',
        'Vilém',
        'Vít',
        'Vítězslav',
        'Vladan',
        'Vladislav',
        'Vlastislav',
        'Vratislav',
        'Zbyněk',
        'Zoltán',
        'Adéla',
        'Alena',
        'Andrea',
        'Anna',
        'Barbora',
        'Blanka',
        'Dagmar',
        'Dana',
        'Daniela',
        'Denisa',
        'Eliška',
        'Eva',
        'Gabriela',
        'Hana',
        'Helena',
        'Irena',
        'Iva',
        'Ivana',
        'Iveta',
        'Jana',
        'Jarmila',
        'Jaroslava',
        'Jiřina',
        'Jitka',
        'Kamila',
        'Karolína',
        'Kateřina',
        'Klára',
        'Kristýna',
        'Lenka',
        'Lucie',
        'Ludmila',
        'Magdaléna',
        'Marcela',
        'Marie',
        'Markéta',
        'Marta',
        'Martina',
        'Michaela',
        'Miroslava',
        'Monika',
        'Olga',
        'Pavla',
        'Petra',
        'Radka',
        'Romana',
        'Simona',
        'Soňa',
        'Šárka',
        'Tereza',
        'Věra',
        'Veronika',
        'Vladimíra',
        'Zdeňka',
        'Zuzana',
        'Žaneta'
    ],

    // generates an array of three random names
    randomNames(): string[] {
        const listNameLen = this.listOfNames.length
        const randomIndex1 = Math.floor(Math.random() * listNameLen)
        let randomIndex2 = Math.floor(Math.random() * listNameLen)
        // each name should be unique
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * listNameLen)
        }

        let randomIndex3 = Math.floor(Math.random() * listNameLen)
        // each name should be unique
        while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
            randomIndex3 = Math.floor(Math.random() * listNameLen)
        }
        return [
            this.listOfNames[randomIndex1],
            this.listOfNames[randomIndex2],
            this.listOfNames[randomIndex3]
        ]
    }
}
