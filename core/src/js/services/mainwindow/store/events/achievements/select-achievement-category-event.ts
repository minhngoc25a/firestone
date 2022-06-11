import {MainWindowStoreEvent} from '../main-window-store-event';

export class SelectAchievementCategoryEvent implements MainWindowStoreEvent {
    readonly categoryId: string;

    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }

    public static eventName(): string {
        return 'SelectAchievementCategoryEvent';
    }

    public eventName(): string {
        return 'SelectAchievementCategoryEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
