import { Card } from '@/types'

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
    score(boardCards: Card[]): number {
        return boardCards.filter(card => card.flush === 3).length
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
    score(boardCards: Card[]): number {
        return boardCards.filter(card => card.value === 5).length * 2
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
    score(heroCards: number): number {
        return heroCards === 7 || heroCards === 0 ? 4 : 0
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
    score(boardCards: Card[]): number {
        return boardCards.filter(card => card.id === 31).length * 8
    },

    // checks if hero can init hearts
    canInitHeart(card: Card, heroCards: Card[]): boolean {
        const anyNotHeart = heroCards.find(c => c.flush !== 3)
        return card.flush !== 3 || !anyNotHeart
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
