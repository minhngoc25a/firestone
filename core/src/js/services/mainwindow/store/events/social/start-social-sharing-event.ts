import {SafeHtml} from '@angular/platform-browser';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class StartSocialSharingEvent implements MainWindowStoreEvent {
    readonly network: string;
    readonly videoPath: string;
    readonly videoPathOnDisk: string;
    readonly title: SafeHtml;
    readonly achievementName: string;

    constructor(network: string, videoPath: string, videoPathOnDisk: string, title: SafeHtml, achievementName: string) {
        this.network = network;
        this.videoPath = videoPath;
        this.videoPathOnDisk = videoPathOnDisk;
        this.title = title;
        this.achievementName = achievementName;
    }

    public static eventName(): string {
        return 'StartSocialSharingEvent';
    }

    public eventName(): string {
        return 'StartSocialSharingEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
