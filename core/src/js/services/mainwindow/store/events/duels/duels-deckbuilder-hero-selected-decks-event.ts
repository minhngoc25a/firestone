import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsDeckbuilderHeroSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly heroCardId: string) {
    }

    public static eventName(): string {
        return 'DuelsDeckbuilderHeroSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsDeckbuilderHeroSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
