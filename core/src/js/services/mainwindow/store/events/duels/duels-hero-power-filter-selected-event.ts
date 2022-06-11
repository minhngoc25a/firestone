import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsHeroPowerFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: string) {
    }

    public static eventName(): string {
        return 'DuelsHeroPowerFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsHeroPowerFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
