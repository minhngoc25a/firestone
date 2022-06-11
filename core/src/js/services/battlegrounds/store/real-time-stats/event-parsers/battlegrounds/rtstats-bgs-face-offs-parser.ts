import {BgsFaceOff} from '@firestone-hs/hs-replay-xml-parser/dist/lib/model/bgs-face-off';
import {GameType} from '@firestone-hs/reference-data';
import {CardsFacadeService} from '@services/cards-facade.service';
import {GameEvent} from '../../../../../../models/game-event';
import {normalizeHeroCardId} from '../../../../bgs-utils';
import {RealTimeStatsState} from '../../real-time-stats';
import {EventParser} from './../_event-parser';

export class RTStatsBgsFaceOffParser implements EventParser {
    constructor(private readonly allCards: CardsFacadeService) {
    }

    applies(gameEvent: GameEvent, currentState: RealTimeStatsState): boolean {
        return (
            [GameType.GT_BATTLEGROUNDS, GameType.GT_BATTLEGROUNDS_FRIENDLY].includes(currentState.gameType) &&
            gameEvent.type === GameEvent.BATTLEGROUNDS_BATTLE_RESULT
        );
    }

    parse(
        gameEvent: GameEvent,
        currentState: RealTimeStatsState,
    ): RealTimeStatsState | PromiseLike<RealTimeStatsState> {
        const result = gameEvent.additionalData.result;
        const currentWinStreak = result === 'won' ? currentState.currentWinStreak + 1 : 0;
        const highestWinStreak = Math.max(currentState.highestWinStreak, currentWinStreak);
        const newFaceOffs: readonly BgsFaceOff[] = [
            ...(currentState.faceOffs || []),
            {
                turn: currentState.currentTurn,
                playerCardId: undefined,
                damage: gameEvent.additionalData.damage,
                opponentCardId: normalizeHeroCardId(gameEvent.additionalData.opponent, this.allCards),
                result: result,
            },
        ];
        return currentState.update({
            faceOffs: newFaceOffs,
            currentWinStreak: currentWinStreak,
            highestWinStreak: highestWinStreak,
        } as RealTimeStatsState);
    }

    name(): string {
        return 'RTStatsBgsFaceOffParser';
    }
}
