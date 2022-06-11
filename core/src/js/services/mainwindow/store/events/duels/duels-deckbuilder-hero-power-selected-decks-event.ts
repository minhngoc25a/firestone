import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsDeckbuilderHeroPowerSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly heroPowerCardId: string) {
    }

    public static eventName(): string {
        return 'DuelsDeckbuilderHeroPowerSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsDeckbuilderHeroPowerSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
