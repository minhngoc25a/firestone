import {DuelsStatTypeFilterType} from '../../../../../models/duels/duels-stat-type-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsStatTypeFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: DuelsStatTypeFilterType) {
    }

    public static eventName(): string {
        return 'DuelsStatTypeFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsStatTypeFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
