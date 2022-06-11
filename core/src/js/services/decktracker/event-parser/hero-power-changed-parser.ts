import {CardsFacadeService} from '@services/cards-facade.service';
import {DeckCard} from '../../../models/decktracker/deck-card';
import {DeckState} from '../../../models/decktracker/deck-state';
import {GameState} from '../../../models/decktracker/game-state';
import {GameEvent} from '../../../models/game-event';
import {LocalizationFacadeService} from '../../localization-facade.service';
import {EventParser} from './event-parser';

export class HeroPowerChangedParser implements EventParser {
    constructor(private readonly cards: CardsFacadeService, private readonly i18n: LocalizationFacadeService) {
    }

    applies(gameEvent: GameEvent, state: GameState): boolean {
        return state && gameEvent.type === GameEvent.HERO_POWER_CHANGED;
    }

    async parse(currentState: GameState, gameEvent: GameEvent): Promise<GameState> {
        const [cardId, controllerId, localPlayer, entityId] = gameEvent.parse();

        const isPlayer = controllerId === localPlayer.PlayerId;
        const deck = isPlayer ? currentState.playerDeck : currentState.opponentDeck;
        const dbCard = this.cards.getCard(cardId);
        const card = DeckCard.create({
            cardId: cardId,
            entityId: entityId,
            cardName: this.i18n.getCardName(cardId, dbCard.name),
            manaCost: dbCard.cost,
            rarity: dbCard.rarity,
            zone: 'PLAY',
            temporaryCard: false,
            playTiming: GameState.playTiming++,
        } as DeckCard);
        const newPlayerDeck = Object.assign(new DeckState(), deck, {
            heroPower: card,
        } as DeckState);
        return Object.assign(new GameState(), currentState, {
            [isPlayer ? 'playerDeck' : 'opponentDeck']: newPlayerDeck,
        });
    }

    event(): string {
        return GameEvent.HERO_POWER_CHANGED;
    }
}
