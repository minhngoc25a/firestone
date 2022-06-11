import {MainWindowStoreEvent} from '../main-window-store-event';

export class TriggerSocialNetworkLoginToggleEvent implements MainWindowStoreEvent {
    readonly network: string;

    constructor(network: string) {
        this.network = network;
    }

    public static eventName(): string {
        return 'TriggerSocialNetworkLoginToggleEvent';
    }

    public eventName(): string {
        return 'TriggerSocialNetworkLoginToggleEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
