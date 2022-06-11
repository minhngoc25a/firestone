import {MainWindowStoreEvent} from '../main-window-store-event';

export class ShowCardDetailsEvent implements MainWindowStoreEvent {
    readonly cardId: string;

    constructor(cardId: string) {
        this.cardId = cardId;
    }

    public static eventName(): string {
        return 'ShowCardDetailsEvent';
    }

    public eventName(): string {
        return 'ShowCardDetailsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
