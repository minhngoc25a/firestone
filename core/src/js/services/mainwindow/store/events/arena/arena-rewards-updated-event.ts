import {Input} from '@firestone-hs/api-arena-rewards/dist/sqs-event';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class ArenaRewardsUpdatedEvent implements MainWindowStoreEvent {
    constructor(public readonly rewards: Input) {
    }

    public static eventName(): string {
        return 'ArenaRewardsUpdatedEvent';
    }

    public eventName(): string {
        return 'ArenaRewardsUpdatedEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }

    public isResetHistoryEvent(): boolean {
        return false;
    }
}
