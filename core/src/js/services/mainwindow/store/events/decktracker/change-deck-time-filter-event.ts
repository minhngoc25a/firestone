import {DeckTimeFilterType} from '../../../../../models/mainwindow/decktracker/deck-time-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class ChangeDeckTimeFilterEvent implements MainWindowStoreEvent {
    constructor(public readonly newFormat: DeckTimeFilterType) {
    }

    public static eventName(): string {
        return 'ChangeDeckTimeFilterEvent';
    }

    public eventName(): string {
        return 'ChangeDeckTimeFilterEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
