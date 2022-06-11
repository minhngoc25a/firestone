import {DuelsHeroSortFilterType} from '../../../../../models/duels/duels-hero-sort-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsHeroSortFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: DuelsHeroSortFilterType) {
    }

    public static eventName(): string {
        return 'DuelsHeroSortFilterSelectedEvent';
    }

    public eventName(): string {
        return 'DuelsHeroSortFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
