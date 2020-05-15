import { Card } from '@/types'
import store from '@/store'

/**
 *  NAMES OF MODES
 */
export const gameModes = {
    name(): string {
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
    }
}

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
    ): Card {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : cards[cards.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return currentCard
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
    ): Card {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return currentCard
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
    ): Card {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return currentCard
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
    ): Card {
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return currentCard
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
    ): Card {
        sortedDeck =
            sortedDeck.length === 8
                ? sortedDeck.filter(c => c.id !== 31)
                : sortedDeck
        let currentCard = eligeableCards.length
            ? eligeableCards.find(c => c.value < initCard.value)
            : sortedDeck[sortedDeck.length - 1]

        // if there are some filtered cards with no lower value but the bigger one
        if (!currentCard) currentCard = eligeableCards[0]
        return currentCard
    }
}

/**
 * GAME MODE TENS
 */
export const tens = {
    // cards array for initializing this game mode
    initCards: store.state.cards.map(c => {
        return { ...c, src: './assets/cards/blank.jpg' }
    }) as Card[],

    // count current score
    score(playedCards: Card[]): number[] {
        const score = [0, 0, 0, 0]
        score[0] += 1
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
    }
}

/**
 * LIST OF PLAYER NAMES
 */
export const playerNames = {
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

    takeRandomNames(): string[] {
        const randomIndex1 = Math.floor(Math.random() * this.listOfNames.length)
        let randomIndex2 = Math.floor(Math.random() * this.listOfNames.length)
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * this.listOfNames.length)
        }
        let randomIndex3 = Math.floor(Math.random() * this.listOfNames.length)
        while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
            randomIndex3 = Math.floor(Math.random() * this.listOfNames.length)
        }
        return [this.listOfNames[randomIndex1], this.listOfNames[randomIndex2], this.listOfNames[randomIndex3]]
    }
}
