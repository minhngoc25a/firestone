import {MainWindowStoreEvent} from '../main-window-store-event';

export class MercenariesViewMercDetailsEvent implements MainWindowStoreEvent {
    constructor(public readonly mercenaryId: number) {
    }

    public static eventName(): string {
        return 'MercenariesViewMercDetailsEvent';
    }

    public eventName(): string {
        return 'MercenariesViewMercDetailsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
