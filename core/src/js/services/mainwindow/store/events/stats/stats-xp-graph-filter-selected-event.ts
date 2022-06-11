import {StatsXpGraphSeasonFilterType} from '../../../../../models/mainwindow/stats/stats-xp-graph-season-filter.type';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class StatsXpGraphFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly value: StatsXpGraphSeasonFilterType) {
    }

    public static eventName(): string {
        return 'StatsXpGraphFilterSelectedEvent';
    }

    public eventName(): string {
        return 'StatsXpGraphFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
