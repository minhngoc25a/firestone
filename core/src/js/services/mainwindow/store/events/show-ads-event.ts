import {MainWindowStoreEvent} from './main-window-store-event';

export class ShowAdsEvent implements MainWindowStoreEvent {
    constructor(public readonly showAds: boolean) {
    }

    public static eventName(): string {
        return 'ShowAdsEvent';
    }

    public eventName(): string {
        return 'ShowAdsEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
