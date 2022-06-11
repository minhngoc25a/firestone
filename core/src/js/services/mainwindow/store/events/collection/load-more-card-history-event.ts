import {MainWindowStoreEvent} from '../main-window-store-event';

export class LoadMoreCardHistoryEvent implements MainWindowStoreEvent {
    readonly maxResults: number;

    constructor(maxResults: number) {
        this.maxResults = maxResults;
    }

    public static eventName(): string {
        return 'LoadMoreCardHistoryEvent';
    }

    public eventName(): string {
        return 'LoadMoreCardHistoryEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
