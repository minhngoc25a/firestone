import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsViewPersonalDeckDetailsEvent implements MainWindowStoreEvent {
    constructor(public readonly deckstring: string) {
    }

    public static eventName(): string {
        return 'DuelsViewPersonalDeckDetailsEvent';
    }

    public eventName(): string {
        return 'DuelsViewPersonalDeckDetailsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
