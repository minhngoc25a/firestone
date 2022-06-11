import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsDeckbuilderSignatureTreasureSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly signatureTreasureCardId: string) {
    }

    public static eventName(): string {
        return 'DuelsDeckbuilderSignatureTreasureSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsDeckbuilderSignatureTreasureSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
