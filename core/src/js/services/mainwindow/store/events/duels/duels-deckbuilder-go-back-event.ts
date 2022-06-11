import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsDeckbuilderGoBackEvent implements MainWindowStoreEvent {
    constructor(public readonly step: 'hero' | 'hero-power' | 'signature-treasure') {
    }

    public static eventName(): string {
        return 'DuelsDeckbuilderGoBackEvent';
    }

    public eventName(): string {
        return 'DuelsDeckbuilderGoBackEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
