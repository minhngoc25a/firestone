import {ReferenceCard} from '@firestone-hs/reference-data';
import {CardsFacadeService} from '@services/cards-facade.service';

export function buildCardArraysFromDeck(deck: any, cards: CardsFacadeService): readonly ReferenceCard[] {
    return deck.cards
        .map((pair) => fillArray(isNaN(+pair[0]) ? cards.getCard(pair[0]) : cards.getCardFromDbfId(+pair[0]), pair[1]))
        .reduce((a, b) => a.concat(b))
        .filter((card) => card);
}

function fillArray(value, len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}
