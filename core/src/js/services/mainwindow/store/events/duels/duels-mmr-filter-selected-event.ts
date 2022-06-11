import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsMmrFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: 100 | 50 | 25 | 10 | 1) {
    }

    public static eventName(): string {
        return 'DuelsMmrFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsMmrFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
