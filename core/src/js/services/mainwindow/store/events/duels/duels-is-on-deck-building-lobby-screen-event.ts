import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsIsOnDeckBuildingLobbyScreenEvent implements MainWindowStoreEvent {
    constructor(public readonly value: boolean) {
    }

    public static eventName(): string {
        return 'DuelsIsOnDeckBuildingLobbyScreenEvent';
    }

    public eventName(): string {
        return 'DuelsIsOnDeckBuildingLobbyScreenEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
