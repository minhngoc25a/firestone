import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsHeroSearchEvent implements MainWindowStoreEvent {
    constructor(public readonly value: string) {
    }

    public static eventName(): string {
        return 'DuelsHeroSearchEvent';
    }

    public eventName(): string {
        return 'DuelsHeroSearchEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
