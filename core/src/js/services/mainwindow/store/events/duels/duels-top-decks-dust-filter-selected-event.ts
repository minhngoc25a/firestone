import {DuelsTopDecksDustFilterType} from '../../../../../models/duels/duels-types';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsTopDecksDustFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: DuelsTopDecksDustFilterType) {
    }

    public static eventName(): string {
        return 'DuelsTopDecksDustFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsTopDecksDustFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
