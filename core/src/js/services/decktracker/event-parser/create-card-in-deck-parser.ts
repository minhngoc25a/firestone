import {CardIds} from '@firestone-hs/reference-data';
import {CardsFacadeService} from '@services/cards-facade.service';
import {DeckCard} from '../../../models/decktracker/deck-card';
import {DeckState} from '../../../models/decktracker/deck-state';
import {GameState} from '../../../models/decktracker/game-state';
import {GameEvent} from '../../../models/game-event';
import {LocalizationFacadeService} from '../../localization-facade.service';
import {DeckManipulationHelper} from './deck-manipulation-helper';
import {EventParser} from './event-parser';

export class CreateCardInDeckParser implements EventParser {
    constructor(
        private readonly helper: DeckManipulationHelper,
        private readonly allCards: CardsFacadeService,
        private readonly i18n: LocalizationFacadeService,
    ) {
    }

    applies(gameEvent: GameEvent, state: GameState): boolean {
        return state && gameEvent.type === GameEvent.CREATE_CARD_IN_DECK;
    }

    async parse(currentState: GameState, gameEvent: GameEvent): Promise<GameState> {
        const [cardId, controllerId, localPlayer, entityId] = gameEvent.parse();

        const isPlayer = controllerId === localPlayer.PlayerId;
        // Don't add the cards created by C'Thun, as they are added via the subspell handling
        // There is the risk that, if C'Thun is enchanted and that enchantment creates a card in deck, this
        // hack will discard it. For now it's supposed to be enough of a fringe case to not matter vs
        // properly flagging the cards created by C'Thun
        if (gameEvent.additionalData.creatorCardId === CardIds.CthunTheShattered) {
            return currentState;
        }

        const deck = isPlayer ? currentState.playerDeck : currentState.opponentDeck;
        const cardData = cardId?.length ? this.allCards.getCard(cardId) : null;
        const positionFromBottom = buildPositionFromBottom(deck, gameEvent.additionalData.creatorCardId);
        //console.debug('[debug]', 'positionFromBottom', positionFromBottom, deck, gameEvent, currentState);
        const createdByJoust = gameEvent.additionalData.createdByJoust;
        const creatorEntityId = gameEvent.additionalData.creatorEntityId
            ? +gameEvent.additionalData.creatorEntityId
            : null;
        const creatorEntity = creatorEntityId
            ? // Because sometimes the entityId is reversed in the Other zone
            deck.findCard(creatorEntityId) ?? deck.findCard(-creatorEntityId)
            : null;
        //console.debug('[debug]', 'creatorEntity', creatorEntity, gameEvent.additionalData.creatorEntityId, deck);
        const card = DeckCard.create({
            cardId: cardId,
            entityId: entityId,
            cardName: this.buildCardName(cardData, gameEvent.additionalData.creatorCardId),
            manaCost: cardData ? cardData.cost : undefined,
            rarity: cardData && cardData.rarity ? cardData.rarity.toLowerCase() : undefined,
            creatorCardId: gameEvent.additionalData.creatorCardId,
            mainAttributeChange: creatorEntity ? buildAttributeChange(creatorEntity) : null,
            positionFromBottom: positionFromBottom,
            createdByJoust: createdByJoust,
        } as DeckCard);
        //console.debug('[debug]', 'adding card', card);

        const previousDeck = deck.deck;
        const newDeck: readonly DeckCard[] = this.helper.addSingleCardToZone(previousDeck, card);
        const newPlayerDeck = deck.update({
            deck: newDeck,
        });
        //console.debug('[debug]', 'newPlayerDeck', newPlayerDeck);

        if (!card.cardId && !card.entityId) {
            console.warn('Adding unidentified card in deck', card, gameEvent);
        }
        return Object.assign(new GameState(), currentState, {
            [isPlayer ? 'playerDeck' : 'opponentDeck']: newPlayerDeck,
        });
    }

    event(): string {
        return GameEvent.CREATE_CARD_IN_DECK;
    }

    private buildCardName(card: any, creatorCardId: string): string {
        if (card) {
            return this.i18n.getCardName(card.id);
        }
        if (creatorCardId) {
            return this.i18n.getCreatedByCardName(creatorCardId);
        }
        return this.i18n.getUnknownCardName();
    }
}

export const buildPositionFromBottom = (deck: DeckState, creatorCardId: string): number => {
    switch (creatorCardId) {
        // TODO: radar detector
        case CardIds.AmbassadorFaelin1:
        case CardIds.AzsharanDefector:
        case CardIds.AzsharanGardens:
        case CardIds.AzsharanMooncatcher1:
        case CardIds.AzsharanMooncatcher2:
        case CardIds.AzsharanRitual:
        case CardIds.AzsharanSaber:
        case CardIds.AzsharanScavenger:
        case CardIds.AzsharanScroll:
        case CardIds.AzsharanSentinel:
        case CardIds.AzsharanSweeper1:
        case CardIds.AzsharanSweeper2:
        case CardIds.AzsharanTrident:
        case CardIds.AzsharanVessel:
        case CardIds.BootstrapSunkeneer: // TODO: not sure this belongs here in this parser
        case CardIds.Bottomfeeder:
            return DeckCard.deckIndexFromBottom++;
    }
    return undefined;
};

const buildAttributeChange = (card: DeckCard): number => {
    //console.debug('building attribute change', card);
    if (card?.cardId === CardIds.Ignite) {
        return 1 + (card.mainAttributeChange ?? 0);
    }
    if (card?.cardId === CardIds.Bottomfeeder) {
        return 1 + (card.mainAttributeChange ?? 0);
    }
    return null;
};
