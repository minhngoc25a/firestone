import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsDeckbuilderSaveDeckEvent implements MainWindowStoreEvent {
    constructor(public readonly deckstring: string, public readonly deckName: string) {
    }

    public static eventName(): string {
        return 'DuelsDeckbuilderSaveDeckEvent';
    }

    public eventName(): string {
        return 'DuelsDeckbuilderSaveDeckEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
