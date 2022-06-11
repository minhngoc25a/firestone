import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsSignatureTreasureFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: string) {
    }

    public static eventName(): string {
        return 'DuelsSignatureTreasureFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsSignatureTreasureFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
