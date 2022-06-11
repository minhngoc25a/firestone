import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsIsOnMainScreenEvent implements MainWindowStoreEvent {
    constructor(public readonly value: boolean) {
    }

    public static eventName(): string {
        return 'DuelsIsOnMainScreenEvent';
    }

    public eventName(): string {
        return 'DuelsIsOnMainScreenEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
