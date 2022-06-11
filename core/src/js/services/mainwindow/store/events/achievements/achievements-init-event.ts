import {VisualAchievementCategory} from '../../../../../models/visual-achievement-category';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class AchievementsInitEvent implements MainWindowStoreEvent {
    constructor(public readonly categories: readonly VisualAchievementCategory[]) {
    }

    public static eventName(): string {
        return 'AchievementsInitEvent';
    }

    public eventName(): string {
        return 'AchievementsInitEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }
}
