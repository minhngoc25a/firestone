import {DuelsGameModeFilterType} from '../../../../../models/duels/duels-game-mode-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsLeaderboardGameModeFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: DuelsGameModeFilterType) {
    }

    public static eventName(): string {
        return 'DuelsLeaderboardGameModeFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsLeaderboardGameModeFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
