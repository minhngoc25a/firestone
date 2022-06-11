import {RawRequirement} from '../../../../models/achievement/raw-requirement';
import {GameEvent} from '../../../../models/game-event';
import {Requirement} from './_requirement';

export class GameTypeReq implements Requirement {
    private isCorrectGameType: boolean;

    constructor(private readonly gameTypes: readonly number[]) {
    }

    public static create(rawReq: RawRequirement): Requirement {
        if (!rawReq.values || rawReq.values.length === 0) {
            console.error('invalid parameters for GameTypeReq', rawReq);
        }
        return new GameTypeReq(rawReq.values.map((gameType) => parseInt(gameType)));
    }

    reset(): void {
        this.isCorrectGameType = undefined;
    }

    afterAchievementCompletionReset(): void {
        this.isCorrectGameType = undefined;
    }

    isCompleted(): boolean {
        if (process.env.LOCAL_TEST) {
            return true;
        }

        return this.isCorrectGameType;
    }

    test(gameEvent: GameEvent): void {
        if (gameEvent.type === GameEvent.MATCH_METADATA) {
            this.handleEvent(gameEvent);
        }
    }

    private handleEvent(gameEvent: GameEvent) {
        // 	'[debug] [type] handleEvent',
        // 	gameEvent,
        // 	this.gameTypes.indexOf(gameEvent.additionalData.metaData.GameType) !== -1,
        // 	this.gameTypes,
        // );
        if (this.gameTypes.indexOf(gameEvent.additionalData.metaData.GameType) !== -1) {
            this.isCorrectGameType = true;
        }
    }
}
