import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsExploreDecksEvent implements MainWindowStoreEvent {
    constructor(
        public readonly heroCardId: string,
        public readonly heroPowerCardId: string,
        public readonly signatureTreasureCardId: string,
    ) {
    }

    public static eventName(): string {
        return 'DuelsExploreDecksEvent';
    }

    public eventName(): string {
        return 'DuelsExploreDecksEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
