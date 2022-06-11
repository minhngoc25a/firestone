import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsChoosingHeroEvent implements MainWindowStoreEvent {
    constructor(public readonly value: boolean) {
    }

    public static eventName(): string {
        return 'DuelsChoosingHeroEvent';
    }

    public eventName(): string {
        return 'DuelsChoosingHeroEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
