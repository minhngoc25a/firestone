import {DeckInfoFromMemory} from '@models/mainwindow/decktracker/deck-info-from-memory';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsCurrentDeckEvent implements MainWindowStoreEvent {
    constructor(public readonly deck: DeckInfoFromMemory) {
    }

    public static eventName(): string {
        return 'DuelsCurrentDeckEvent';
    }

    public eventName(): string {
        return 'DuelsCurrentDeckEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
