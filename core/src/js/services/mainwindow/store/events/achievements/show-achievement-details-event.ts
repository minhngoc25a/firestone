import {MainWindowStoreEvent} from '../main-window-store-event';

export class ShowAchievementDetailsEvent implements MainWindowStoreEvent {
    readonly achievementId: string;

    constructor(achievementId: string) {
        this.achievementId = achievementId;
    }

    public static eventName(): string {
        return 'ShowAchievementDetailsEvent';
    }

    public eventName(): string {
        return 'ShowAchievementDetailsEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
