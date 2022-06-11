import {MainWindowStoreEvent} from '../main-window-store-event';

export class ChangeVisibleAchievementEvent implements MainWindowStoreEvent {
    readonly achievementId: string;

    constructor(achievementId: string) {
        this.achievementId = achievementId;
    }

    public static eventName(): string {
        return 'ChangeVisibleAchievementEvent';
    }

    public eventName(): string {
        return 'ChangeVisibleAchievementEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
