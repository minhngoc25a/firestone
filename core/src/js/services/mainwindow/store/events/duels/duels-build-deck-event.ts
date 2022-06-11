import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsBuildDeckEvent implements MainWindowStoreEvent {
    constructor(
        public readonly heroCardId: string,
        public readonly heroPowerCardId: string,
        public readonly signatureTreasureCardId: string,
    ) {
    }

    public static eventName(): string {
        return 'DuelsBuildDeckEvent';
    }

    public eventName(): string {
        return 'DuelsBuildDeckEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
