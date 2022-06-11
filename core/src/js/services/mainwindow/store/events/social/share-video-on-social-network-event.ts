import {MainWindowStoreEvent} from '../main-window-store-event';

export class ShareVideoOnSocialNetworkEvent implements MainWindowStoreEvent {
    readonly network: string;
    readonly videoPathOnDisk: string;
    readonly message: string;

    constructor(network: string, videoPathOnDisk: string, message: string) {
        this.network = network;
        this.videoPathOnDisk = videoPathOnDisk;
        this.message = message;
    }

    public static eventName(): string {
        return 'ShareVideoOnSocialNetworkEvent';
    }

    public eventName(): string {
        return 'ShareVideoOnSocialNetworkEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
