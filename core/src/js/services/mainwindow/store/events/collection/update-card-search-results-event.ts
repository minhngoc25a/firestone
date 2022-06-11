import {MainWindowStoreEvent} from '../main-window-store-event';

export class UpdateCardSearchResultsEvent implements MainWindowStoreEvent {
    readonly searchString: string;

    constructor(searchString: string) {
        this.searchString = searchString;
    }

    public static eventName(): string {
        return 'UpdateCardSearchResultsEvent';
    }

    public eventName(): string {
        return 'UpdateCardSearchResultsEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
