import {BinderState} from '../../../../../models/mainwindow/binder-state';
import {MainWindowStoreEvent} from '../main-window-store-event';

export class CollectionInitEvent implements MainWindowStoreEvent {
    constructor(public readonly newState: BinderState) {
    }

    public static eventName(): string {
        return 'CollectionInitEvent';
    }

    public eventName(): string {
        return 'CollectionInitEvent';
    }

    public isNavigationEvent(): boolean {
        return false;
    }
}
