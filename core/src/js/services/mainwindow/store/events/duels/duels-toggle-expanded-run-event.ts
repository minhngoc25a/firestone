import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsToggleExpandedRunEvent implements MainWindowStoreEvent {
    constructor(public readonly runId: string) {
    }

    public static eventName(): string {
        return 'DuelsToggleExpandedRunEvent';
    }

    public eventName(): string {
        return 'DuelsToggleExpandedRunEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
