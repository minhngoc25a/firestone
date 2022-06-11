import {MainWindowState} from '../../../../../models/mainwindow/main-window-state';
import {NavigationState} from '../../../../../models/mainwindow/navigation/navigation-state';
import {PreferencesService} from '../../../../preferences.service';
import {
    MercenariesPveDifficultyFilterSelectedEvent
} from '../../events/mercenaries/mercenaries-pve-difficulty-filter-selected-event';
import {Processor} from '../processor';

export class MercenariesPveDifficultyFilterSelectedProcessor implements Processor {
    constructor(private readonly prefs: PreferencesService) {
    }

    public async process(
        event: MercenariesPveDifficultyFilterSelectedEvent,
        currentState: MainWindowState,
        history,
        navigationState: NavigationState,
    ): Promise<[MainWindowState, NavigationState]> {
        await this.prefs.updateMercenariesPveDifficultyFilter(event.difficulty);
        return [null, null];
    }
}
