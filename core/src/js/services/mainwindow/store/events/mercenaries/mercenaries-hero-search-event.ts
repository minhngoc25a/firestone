import {MainWindowStoreEvent} from '../main-window-store-event';

export class MercenariesHeroSearchEvent implements MainWindowStoreEvent {
    constructor(public readonly value: string) {
    }

    public static eventName(): string {
        return 'MercenariesHeroSearchEvent';
    }

    public eventName(): string {
        return 'MercenariesHeroSearchEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
