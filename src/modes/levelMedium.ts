import { Card } from '@/types'
import { sortBy } from 'lodash-es'
import store from '@/store'

// filtering players cards w/ the same flush
const filterFlushCards = (deck: Card[]) => {
    return deck.filter(c => c.flush === store.state.initCard.flush) as Card[]
}

// checking if there are any cards with the same flush
const isFlushMax = (card: Card, deck: Card[]): boolean => {
    const countBiggerFlushOut = store.state.alreadyPlayedCards.filter(
        c => c.flush === card.flush && c.value > card.value
    ).length
    const countBiggerFlushDeck = deck.filter(
        c => c.flush === card.flush && c.value > card.value
    ).length
    return card.value + 1 + countBiggerFlushOut + countBiggerFlushDeck === 8
}

// checking if there are any cards with the same flush
const isFlushOut = (card: Card, deck: Card[]): boolean => {
    const countFlushOut = store.state.alreadyPlayedCards.filter(
        c => c.flush === card.flush && c.value > card.value
    ).length
    const countFlushDeck = deck.filter(c => c.flush === card.flush).length
    return countFlushOut + countFlushDeck === 8
}

const sortDeckAccordingToFlush = (deck: Card[]): Card[] => {
    let newObj = deck.map(card => {
        return {
            card: card,
            count: deck.filter(c => c.flush === card.flush).length
        }
    })
    newObj = sortBy(newObj, ['count'])
    return newObj.map(obj => obj.card)
}

/**
 * GAME MODE HEARTS
 */
export const hearts = {
    // checks if hero can init hearts
    canInitHeart(card: Card): boolean {
        const anyNotHeart = store.state.playersCards[3].find(c => c.flush !== 3)
        return card.flush !== 3 || !anyNotHeart
    },

    // count current score
    score(): number[] {
        const score = [0, 0, 0, 0]
        score[store.state.currentLoser] += store.state.boardCards.filter(
            card => card.flush === 3
        ).length
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const anyNotHearts = sortedDeck.filter(card => card.flush !== 3)

        const heroCount = store.state.playersCards[3].length
        let card
        if (anyNotHearts.length) {
            if (heroCount > 6) {
                let i = anyNotHearts.length
                card = anyNotHearts[i - 1]
                while (isFlushOut(card, sortedDeck) && i >= 0) {
                    card = anyNotHearts[i--]
                }
                return card
            }
            let i = 0
            card = anyNotHearts[i]
            while (isFlushMax(card, sortedDeck) && i < anyNotHearts.length) {
                card = anyNotHearts[i++]
            }
        } else card = sortedDeck[0]
        return card
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card
    villainReactCard(sortedDeck: Card[]): Card[] {
        const eligeableCards = filterFlushCards(sortedDeck)
        const flushBoardCards = store.state.boardCards.filter(
            c => c.flush === store.state.initCard.flush
        )
        let currentCard
        const lowerCards = eligeableCards.filter(
            c => c.value < Math.max(...flushBoardCards.map(c => c.value))
        )
        // if any eligeable lower card is available
        const anyBadBoardCard = store.state.boardCards.filter(
            c => c.flush === 3
        )
        const boardLen = store.state.boardCards.length
        if (lowerCards.length) {
            currentCard =
                !anyBadBoardCard.length &&
                boardLen === 3 &&
                sortedDeck.length > 4
                    ? eligeableCards[eligeableCards.length - 1]
                    : lowerCards[lowerCards.length - 1]
            // if there are some filtered cards with no lower value but the bigger one
        } else if (eligeableCards.length) {
            currentCard =
                store.state.boardCards.length === 3
                    ? eligeableCards[eligeableCards.length - 1]
                    : eligeableCards[0]
        } else {
            const villainBadCards = sortedDeck.filter(c => c.flush === 3)
            const badCardsLen = villainBadCards.length
            currentCard = badCardsLen
                ? villainBadCards[badCardsLen - 1]
                : sortedDeck[sortedDeck.length - 1]
        }
        return [currentCard]
    }
}

/**
 * GAME MODE QUEENS
 */
export const queens = {
    // count current score
    score(): number[] {
        const score = [0, 0, 0, 0]
        score[store.state.currentLoser] +=
            store.state.boardCards.filter(card => card.value === 5).length * 2
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        let i = 0
        let card = sortedDeck[i]
        while (isFlushMax(card, sortedDeck) && i < sortedDeck.length) {
            card = sortedDeck[i++]
        }

        return card
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(sortedDeck: Card[]): Card[] {
        const eligeableCards = filterFlushCards(sortedDeck)
        const flushBoardCards = store.state.boardCards.filter(
            c => c.flush === store.state.initCard.flush
        )
        let currentCard
        const lowerCards = eligeableCards.filter(
            c => c.value < Math.max(...flushBoardCards.map(c => c.value))
        )

        // if any eligeable lower card is available
        const anyBadBoardCard = store.state.boardCards.find(c => c.value === 5)
        const boardLen = store.state.boardCards.length
        if (lowerCards.length) {
            const eligCardMax = eligeableCards[eligeableCards.length - 1]
            currentCard =
                !anyBadBoardCard &&
                eligCardMax.value !== 5 &&
                boardLen === 3 &&
                sortedDeck.length > 4
                    ? eligCardMax
                    : lowerCards[lowerCards.length - 1]

            // if there are some filtered cards with no lower value but the bigger one
        } else if (eligeableCards.length) {
            currentCard =
                store.state.boardCards.length === 3
                    ? eligeableCards[eligeableCards.length - 1]
                    : eligeableCards[0]
        } else {
            const anyQueen = sortedDeck.filter(c => c.value === 5)
            let theQueen = {} as Card
            if (anyQueen.length) {
                theQueen = sortDeckAccordingToFlush(anyQueen)[0]
            }
            currentCard = anyQueen.length
                ? theQueen
                : sortedDeck[sortedDeck.length - 1]
        }
        return [currentCard]
    }
}

/**
 * GAME MODE FILA
 */
export const fila = {
    // count current score
    score(): number[] {
        const heroCount = store.state.playersCards[3].length
        const score = [0, 0, 0, 0]
        score[store.state.currentLoser] +=
            heroCount === 7 || heroCount === 0 ? 4 : 0
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const cardsCount = sortedDeck.length
        let card
        if (cardsCount !== 8 && cardsCount > 3) {
            let i = cardsCount - 1
            card = sortedDeck[i]
            while (isFlushMax(card, sortedDeck) && i >= 0) {
                card = sortedDeck[i--]
            }
        } else card = sortedDeck[0]

        return card
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(sortedDeck: Card[]): Card[] {
        const eligeableCards = filterFlushCards(sortedDeck)
        const flushBoardCards = store.state.boardCards.filter(
            c => c.flush === store.state.initCard.flush
        )
        let currentCard
        const lowerCards = eligeableCards.filter(
            c => c.value < Math.max(...flushBoardCards.map(c => c.value))
        )

        if (
            sortedDeck.length !== 8 &&
            sortedDeck.length > 4 &&
            eligeableCards.length
        )
            return [eligeableCards[eligeableCards.length - 1]]

        // if any eligeable card is available
        if (lowerCards.length) {
            currentCard = lowerCards[lowerCards.length - 1]
            // if there are some filtered cards with no lower value but the bigger one
        } else if (eligeableCards.length) {
            currentCard =
                store.state.boardCards.length === 3
                    ? eligeableCards[eligeableCards.length - 1]
                    : eligeableCards[0]
        } else {
            currentCard = sortedDeck[sortedDeck.length - 1]
        }
        return [currentCard]
    }
}

/**
 * GAME MODE ANY
 */
export const any = {
    // count current score
    score(): number[] {
        const score = [0, 0, 0, 0]
        score[store.state.currentLoser] += 1
        return score
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        let i = 0
        let card = sortedDeck[i]
        while (isFlushMax(card, sortedDeck) && i < sortedDeck.length) {
            card = sortedDeck[i++]
        }

        return card
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(sortedDeck: Card[]): Card[] {
        const eligeableCards = filterFlushCards(sortedDeck)
        const flushBoardCards = store.state.boardCards.filter(
            c => c.flush === store.state.initCard.flush
        )
        let currentCard
        const lowerCards = eligeableCards.filter(
            c => c.value < Math.max(...flushBoardCards.map(c => c.value))
        )

        // if any eligeable card is available
        if (lowerCards.length) {
            currentCard = lowerCards[lowerCards.length - 1]
            // if there are some filtered cards with no lower value but the bigger one
        } else if (eligeableCards.length) {
            currentCard =
                store.state.boardCards.length === 3
                    ? eligeableCards[eligeableCards.length - 1]
                    : eligeableCards[0]
        } else {
            currentCard = sortedDeck[sortedDeck.length - 1]
        }
        return [currentCard]
    }
}

/**
 * GAME MODE KING
 */
export const king = {
    // count current score
    score(): number[] {
        const score = [0, 0, 0, 0]
        score[store.state.currentLoser] +=
            store.state.boardCards.filter(card => card.id === 31).length * 8
        return score
    },

    // checks if hero can init hearts
    canInitHeart(card: Card): boolean {
        const anyNotHeart = store.state.playersCards[3].find(c => c.flush !== 3)
        return card.flush !== 3 || !anyNotHeart
    },

    // checks if hero can red queen
    isRedKingFirst(card: Card): boolean {
        const heroCount = store.state.playersCards[3].length
        return card.id === 31 && heroCount === 8
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const anyNotHearts = sortedDeck.filter(card => card.flush !== 3)
        const heroCount = store.state.playersCards[3].length
        let card
        if (anyNotHearts.length) {
            if (heroCount === 8) return anyNotHearts[anyNotHearts.length - 1]
            let i = 0
            card = anyNotHearts[i]
            while (isFlushMax(card, sortedDeck) && i < anyNotHearts.length) {
                card = anyNotHearts[i++]
            }
        } else card = sortedDeck[0]
        return card
    },

    // if filtered cards turns any lower one than the init card
    // otherwise turns a card w/ the biggest value
    villainReactCard(sortedDeck: Card[]): Card[] {
        // the very first turn is not allowed to play the red queen
        const resortedDeck =
            sortedDeck.length === 8
                ? sortedDeck.filter(c => c.id !== 31)
                : sortedDeck
        const redKing = resortedDeck.find(c => c.id === 31)

        const eligeableCards = filterFlushCards(resortedDeck)
        const flushBoardCards = store.state.boardCards.filter(
            c => c.flush === store.state.initCard.flush
        )
        let currentCard
        const lowerCards = eligeableCards.filter(
            c => c.value < Math.max(...flushBoardCards.map(c => c.value))
        )

        // if any eligeable lower card is available
        const boardLen = store.state.boardCards.length
        if (lowerCards.length) {
            currentCard =
                !redKing && boardLen === 3 && sortedDeck.length > 4
                    ? eligeableCards[eligeableCards.length - 1]
                    : lowerCards[lowerCards.length - 1]
            // if there are some filtered cards with no lower value but the bigger one
        } else if (eligeableCards.length) {
            currentCard =
                store.state.boardCards.length === 3
                    ? eligeableCards[eligeableCards.length - 1]
                    : eligeableCards[0]
        } else {
            currentCard = redKing
                ? redKing
                : resortedDeck[resortedDeck.length - 1]
        }
        return [currentCard]
    }
}

/**
 * GAME MODE QUARTERS
 */
export const quarters = {
    // count current score
    score(): number[] {
        const score = store.state.playersCards.map(player => player.length)
        return score
    },

    canInitCard(card: Card, playersCards: Card[]): boolean {
        return (
            card.value < 5 || playersCards.find(c => c.value < 5) === undefined
        )
    },

    canPlayCard(card: Card, initCard: Card): boolean {
        return (
            card.value >= initCard.value &&
            card.value - initCard.value <= 3 &&
            card.flush === initCard.flush
        )
    },

    // returns villains init card to turn
    villainInitCard(sortedDeck: Card[]): Card {
        const deckLen = sortedDeck.length
        let deck = sortedDeck
        if (deckLen === 8) {
            deck = deck.filter(c => this.canInitCard(c, sortedDeck))
        }
        const aces = deck.filter(c => c.value === 7)
        const eligeableIds = [] as number[]
        eligeableIds.push(...store.state.alreadyPlayedCards.map(c => c.id - 1))
        if (eligeableIds.length) {
            eligeableIds.forEach(id => {
                eligeableIds.push(id - 3)
                eligeableIds.push(id - 2)
                eligeableIds.push(id - 1)
            })
        }
        if (aces.length) {
            aces.forEach(ace => {
                eligeableIds.push(ace.id - 3)
                eligeableIds.push(ace.id - 2)
                eligeableIds.push(ace.id - 1)
            })
        }
        sortedDeck.forEach(c => {
            eligeableIds.push(c.id - 3)
        })
        const eligeableCard = deck.find(c => eligeableIds.includes(c.id))
        if (eligeableCard) return eligeableCard
        else if (aces.length) return aces[0]
        else {
            const resorted = sortDeckAccordingToFlush(deck)
            return deckLen === 8 ? resorted[0] : resorted[resorted.length - 1]
        }
    },

    villainReactCards(playerCards: Card[]): Card[] {
        const eligeableCards = playerCards.filter(card =>
            this.canPlayCard(card, store.state.initCard)
        )
        return eligeableCards
    },

    noEligeableCard(cards: Card[]): boolean {
        const eligeableCards = cards.filter(card =>
            this.canPlayCard(card, store.state.initCard)
        )
        return eligeableCards.length === 0
    },

    isOver(): boolean {
        const anyoneWithNoCards = store.state.playersCards.find(
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
        return { ...c, src: '/assets/cardsmini/blank.jpg' }
    }) as Card[],

    // count current score
    score(): number[] {
        const score = store.state.playersCards.map(player => player.length)
        return score
    },

    canPlayCard(card: Card): boolean {
        let canPlayCard = false
        // if card is ten and ten only
        if (card.value === 3) canPlayCard = true
        // lower card than ten must have its higher neighbour
        else if (card.value < 3) {
            canPlayCard =
                store.state.alreadyPlayedCards.find(
                    c => c.id === card.id + 1
                ) !== undefined
            // higher card than ten must have its lower neighbour
        } else {
            canPlayCard =
                store.state.alreadyPlayedCards.find(
                    c => c.id === card.id - 1
                ) !== undefined
        }
        return canPlayCard
    },

    villainTurn(sortedDeck: Card[]): Card[] {
        const tens = sortedDeck.filter(card => card.value === 3)
        const lowCards = sortedDeck.filter(card => card.value < 3)
        const highCards = sortedDeck.filter(card => card.value > 3)
        const resortedDeck = [...tens, ...lowCards.reverse(), ...highCards]
        let eligeableCards = resortedDeck.filter(card => this.canPlayCard(card))

        if (!eligeableCards.length) return []
        else {
            eligeableCards = sortDeckAccordingToFlush(eligeableCards)
        }
        return eligeableCards.length === resortedDeck.length
            ? eligeableCards
            : [eligeableCards[eligeableCards.length - 1]]
    },

    noEligeableCard(cards: Card[]): boolean {
        const eligeableCards = cards.filter(card => this.canPlayCard(card))
        return eligeableCards.length === 0
    }
}

/**
 * EXAM SELECT
 */
export const exam = {
    selectGame(sortedDeck: Card[]): number {
        if (
            sortedDeck.filter(c => c.value > 3).length > 4 && // 5+ cards higher than ten
            sortedDeck.filter(c => c.value === 7).length > 1 // at least two aces in the deck
        )
            return 5
        return 4
    }
}

/**
 * GENERAL RULES FOR MORE GAME MODES
 */
export const general = {
    isFlushValid(card: Card, playerCards: Card[], initCard: Card): boolean {
        // finds any player's card with flush equals to the initializing one
        const anyFlushCard = playerCards.find(c => c.flush === initCard.flush)
        return card.flush === initCard.flush || anyFlushCard === undefined
    },
    noCardsCheck(): boolean {
        const anyoneWithNoCards = store.state.playersCards.find(
            player => player.length === 0
        )
        return anyoneWithNoCards !== undefined
    },

    // list of all game modes
    listOfGameModes: [
        'Červené',
        'Filky',
        'Pr-Po',
        'Všechny',
        'Bedrník',
        'Kvarty',
        'Desítky'
    ],

    gameMode(): string {
        let name = ''
        switch (store.state.mode) {
            case 0:
                name = 'Červené'
                break
            case 1:
                name = 'Filky'
                break
            case 2:
                name = 'Pr-Po'
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
                name = 'Výběr'
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
