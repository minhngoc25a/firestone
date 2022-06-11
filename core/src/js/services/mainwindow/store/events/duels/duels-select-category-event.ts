import {DuelsCategoryType} from '../../../../../models/mainwindow/duels/duels-category.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsSelectCategoryEvent implements MainWindowStoreEvent {
    constructor(public readonly categoryId: DuelsCategoryType) {
    }

    public static eventName(): string {
        return 'DuelsSelectCategoryEvent';
    }

    public eventName(): string {
        return 'DuelsSelectCategoryEvent';
    }

    public isNavigationEvent(): boolean {
        return true;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
