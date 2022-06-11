import {GameState} from '../../../models/decktracker/game-state';
import {HeroCard} from '../../../models/decktracker/hero-card';
import {GameEvent} from '../../../models/game-event';
import {EventParser} from './event-parser';

export class HeroRevealedParser implements EventParser {
    applies(gameEvent: GameEvent, state: GameState): boolean {
        return state && gameEvent.type === GameEvent.HERO_REVEALED;
    }

    async parse(currentState: GameState, gameEvent: GameEvent): Promise<GameState> {
        const [cardId, controllerId, localPlayer, entityId] = gameEvent.parse();
        const health = gameEvent.additionalData.health;

        const isPlayer = controllerId === localPlayer.PlayerId;
        const deck = isPlayer ? currentState.playerDeck : currentState.opponentDeck;

        const existingHero = deck.hero ?? HeroCard.create({});
        const newHero = existingHero.update({
            cardId: cardId,
            entityId: entityId,
            maxHealth: health,
        });
        const newPlayerDeck = deck.update({
            hero: newHero,
        });
        return Object.assign(new GameState(), currentState, {
            [isPlayer ? 'playerDeck' : 'opponentDeck']: newPlayerDeck,
        });
    }

    event(): string {
        return GameEvent.HERO_REVEALED;
    }
}
