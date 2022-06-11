import {MainWindowStoreEvent} from '../main-window-store-event';

export class SearchCardsEvent implements MainWindowStoreEvent {
    readonly searchString: string;

    constructor(searchString: string) {
        this.searchString = searchString;
    }

    public static eventName(): string {
        return 'SearchCardsEvent';
    }

    public eventName(): string {
        return 'SearchCardsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
