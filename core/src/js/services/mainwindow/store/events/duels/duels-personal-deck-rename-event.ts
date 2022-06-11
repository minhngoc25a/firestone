import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsPersonalDeckRenameEvent implements MainWindowStoreEvent {
    constructor(public readonly deckstring: string, public readonly newName: string) {
    }

    public static eventName(): string {
        return 'DuelsPersonalDeckRenameEvent';
    }

    public eventName(): string {
        return 'DuelsPersonalDeckRenameEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
