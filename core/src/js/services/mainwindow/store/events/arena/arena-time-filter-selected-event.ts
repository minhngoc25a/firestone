import {ArenaTimeFilterType} from '../../../../../models/arena/arena-time-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class ArenaTimeFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: ArenaTimeFilterType) {
    }

    public static eventName(): string {
        return 'ArenaTimeFilterSelectedEvent';
    }

    public eventName(): string {
        return 'ArenaTimeFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
