import {DuelsTreasureStatTypeFilterType} from '../../../../../models/duels/duels-treasure-stat-type-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsTreasurePassiveTypeFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: DuelsTreasureStatTypeFilterType) {
    }

    public static eventName(): string {
        return 'DuelsTreasurePassiveTypeFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsTreasurePassiveTypeFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
