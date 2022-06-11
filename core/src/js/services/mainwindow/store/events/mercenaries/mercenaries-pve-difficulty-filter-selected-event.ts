import {MercenariesPveDifficultyFilterType} from '../../../../../models/mercenaries/mercenaries-filter-types';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class MercenariesPveDifficultyFilterSelectedEvent implements MainWindowStoreEvent {
    constructor(public readonly difficulty: MercenariesPveDifficultyFilterType) {
    }

    public static eventName(): string {
        return 'MercenariesPveDifficultyFilterSelectedEvent';
    }

    public eventName(): string {
        return 'MercenariesPveDifficultyFilterSelectedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }
}
