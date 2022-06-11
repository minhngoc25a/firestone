import {EventEmitter} from '@angular/core';
import {Race} from '@firestone-hs/reference-data';
import {
    BgsTribesFilterSelectedEvent
} from '@services/mainwindow/store/events/battlegrounds/bgs-tribes-filter-selected-event';
import {MainWindowStoreEvent} from '@services/mainwindow/store/events/main-window-store-event';
import {PreferencesService} from '@services/preferences.service';
import {BattlegroundsState} from '../../../../models/battlegrounds/battlegrounds-state';
import {GameState} from '../../../../models/decktracker/game-state';
import {allBgsRaces} from '../../bgs-utils';
import {BgsFilterLiveTribesEvent} from '../events/bgs-filter-live-tribes-event';
import {BattlegroundsStoreEvent} from '../events/_battlegrounds-store-event';
import {EventParser} from './_event-parser';

export class BgsFilterLiveTribesParser implements EventParser {
    constructor(
        private readonly prefs: PreferencesService,
        private readonly stateUpdaterProvider: () => EventEmitter<MainWindowStoreEvent>,
    ) {
    }

    public applies(gameEvent: BattlegroundsStoreEvent, state: BattlegroundsState): boolean {
        return state && state.currentGame && gameEvent.type === 'BgsFilterLiveTribesEvent';
    }

    public async parse(
        currentState: BattlegroundsState,
        event: BgsFilterLiveTribesEvent,
        gameState?: GameState,
    ): Promise<BattlegroundsState> {
        const prefs = await this.prefs.getPreferences();
        await this.prefs.savePreferences({...prefs, bgsUseTribeFilterInHeroSelection: event.filterByLiveTribes});

        const tribesFilter: readonly Race[] = event.filterByLiveTribes
            ? currentState.currentGame.availableRaces
            : allBgsRaces;
        const stateUpdater = this.stateUpdaterProvider();
        stateUpdater.next(new BgsTribesFilterSelectedEvent(tribesFilter));
        return currentState;
    }
}
