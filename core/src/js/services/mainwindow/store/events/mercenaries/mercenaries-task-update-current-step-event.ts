import {MainWindowStoreEvent} from '../main-window-store-event';

export class MercenariesTaskUpdateCurrentStepEvent implements MainWindowStoreEvent {
    constructor(public readonly mercenaryId: number, public readonly operation: 'add' | 'remove') {
    }

    public static eventName(): string {
        return 'MercenariesTaskUpdateCurrentStepEvent';
    }

    public eventName(): string {
        return 'MercenariesTaskUpdateCurrentStepEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
