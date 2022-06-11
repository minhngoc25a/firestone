import {GameState} from '../../../models/decktracker/game-state';
import {GameEvent} from '../../../models/game-event';
import {EventParser} from './event-parser';

export class QuestDestroyedParser implements EventParser {
    // Whenever something occurs that publicly reveal a card, we try to assign its
    // cardId to the corresponding entity
    applies(gameEvent: GameEvent, state: GameState): boolean {
        return state && gameEvent.type === GameEvent.QUEST_DESTROYED;
    }

    async parse(currentState: GameState, gameEvent: GameEvent): Promise<GameState> {
        return currentState;
    }

    event(): string {
        return GameEvent.QUEST_DESTROYED;
    }
}
