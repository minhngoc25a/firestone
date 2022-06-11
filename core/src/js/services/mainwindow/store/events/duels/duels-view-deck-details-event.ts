import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsViewDeckDetailsEvent implements MainWindowStoreEvent {
    constructor(public readonly deckId: number) {
    }

    public static eventName(): string {
        return 'DuelsViewDeckDetailsEvent';
    }

    public eventName(): string {
        return 'DuelsViewDeckDetailsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
