import {DungeonCrawlOptionType} from '@firestone-hs/reference-data';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class DuelsCurrentOptionEvent implements MainWindowStoreEvent {
    constructor(public readonly option: DungeonCrawlOptionType) {
    }

    public static eventName(): string {
        return 'DuelsCurrentOptionEvent';
    }

    public eventName(): string {
        return 'DuelsCurrentOptionEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
