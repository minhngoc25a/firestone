import {CardIds, GameTag} from '@firestone-hs/reference-data';
import {DeckCard} from '../../../models/decktracker/deck-card';
import {DeckState} from '../../../models/decktracker/deck-state';
import {GameState} from '../../../models/decktracker/game-state';
import {GameEvent} from '../../../models/game-event';
import {CardsFacadeService} from '../../cards-facade.service';
import {cardsRevealedWhenDrawn, forceHideInfoWhenDrawnInfluencers, publicCardCreators} from '../../hs-utils';
import {LocalizationFacadeService} from '../../localization-facade.service';
import {DeckManipulationHelper} from './deck-manipulation-helper';
import {EventParser} from './event-parser';

export class CardDrawParser implements EventParser {
    constructor(
        private readonly helper: DeckManipulationHelper,
        private readonly allCards: CardsFacadeService,
        private readonly i18n: LocalizationFacadeService,
    ) {
    }

    applies(gameEvent: GameEvent, state: GameState): boolean {
        return state && gameEvent.type === GameEvent.CARD_DRAW_FROM_DECK;
    }

    async parse(currentState: GameState, gameEvent: GameEvent): Promise<GameState> {
        const [cardId, controllerId, localPlayer, entityId] = gameEvent.parse();
        // console.debug('drawing from deck', cardId, gameEvent);
        const isPlayer = controllerId === localPlayer.PlayerId;
        const deck = isPlayer ? currentState.playerDeck : currentState.opponentDeck;

        const cardsWithMatchingCardId = deck.deck.filter((e) => e.cardId);
        // So that we don't remove the "card from bottom" when the user doesn't know about it, e.g.
        // if a tutor effect draws the entity ID that is at the bottom and we aren't supposed to know
        // about it. This could change (via a whitelist?) if there are cards that start drawing from
        // the bottom of the deck
        const shouldUseEntityId =
            cardsWithMatchingCardId.length === 1 ||
            cardsWithMatchingCardId.every((e) => e.positionFromBottom == null && e.positionFromTop == null);
        if (!shouldUseEntityId) {
            console.debug('not using entity id', shouldUseEntityId, cardsWithMatchingCardId, gameEvent, currentState);
        }
        const card = this.helper.findCardInZone(deck.deck, cardId, shouldUseEntityId ? entityId : null, true);

        const lastInfluencedByCardId = gameEvent.additionalData?.lastInfluencedByCardId ?? card.lastAffectedByCardId;

        const isCardDrawnBySecretPassage = forceHideInfoWhenDrawnInfluencers.includes(
            gameEvent.additionalData?.lastInfluencedByCardId,
        );
        const isTradable = !!this.allCards.getCard(cardId).mechanics?.includes(GameTag[GameTag.TRADEABLE]);
        // console.debug('drawing from deck', isTradable, this.allCards.getCard(cardId));
        const isCardInfoPublic =
            // Also includes a publicCardCreator so that cards drawn from deck when we know what they are (eg
            // Southsea Scoundrel) are flagged
            // Hide the info when card is drawn by Secret Passage? The scenario is:
            // 1. Add a card revealed when drawn to your deck
            // 2. Cast Secret Passage: the card is added to your hand, but the "cast when drawn" effect doesn't trigger
            // (no idea why it behaves like that)
            // 3. As a result, the card info is considered public, and we show it
            isPlayer ||
            (!isCardDrawnBySecretPassage &&
                (cardsRevealedWhenDrawn.includes(cardId as CardIds) ||
                    // So that we prevent an info leak when a card traded back into the deck is drawn via a tutor
                    (!isTradable && publicCardCreators.includes(lastInfluencedByCardId))));
        const isCreatorPublic =
            isCardInfoPublic || (!isTradable && publicCardCreators.includes(lastInfluencedByCardId));

        //console.debug('found card in zone', card, deck, cardId, entityId, isCardInfoPublic);

        const creatorCardId = gameEvent.additionalData?.creatorCardId;
        const cardWithCreator = card.update({
            entityId: entityId,
            creatorCardId: isCardInfoPublic ? creatorCardId : undefined,
            cardId: isCardInfoPublic ? card.cardId : undefined,
            // cardName: isCardInfoPublic ? card.cardName : undefined,
            cardName: isCardInfoPublic ? this.i18n.getCardName(card?.cardId) : undefined,
            lastAffectedByCardId: isCreatorPublic ? lastInfluencedByCardId : undefined,
        } as DeckCard);
        //console.debug('cardWithCreator', cardWithCreator, isCreatorPublic, publicCardCreators, lastInfluencedByCardId);
        const previousDeck = deck.deck;

        const newDeck: readonly DeckCard[] = isCardInfoPublic
            ? this.helper.removeSingleCardFromZone(previousDeck, cardId, entityId, deck.deckList.length === 0, true)[0]
            : this.helper.removeSingleCardFromZone(previousDeck, null, -1, deck.deckList.length === 0, true)[0];
        //console.debug('newDeck', newDeck, isCardInfoPublic, previousDeck);
        const previousHand = deck.hand;
        const newHand: readonly DeckCard[] = this.helper.addSingleCardToZone(previousHand, cardWithCreator);
        //console.debug('added card to hand', newHand);
        const newPlayerDeck = Object.assign(new DeckState(), deck, {
            deck: newDeck,
            hand: newHand,
        });
        return Object.assign(new GameState(), currentState, {
            [isPlayer ? 'playerDeck' : 'opponentDeck']: newPlayerDeck,
        });
    }

    event(): string {
        return GameEvent.CARD_DRAW_FROM_DECK;
    }
}
