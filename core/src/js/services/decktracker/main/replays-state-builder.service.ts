/* eslint-disable @typescript-eslint/no-use-before-define */
import {Injectable} from '@angular/core';
import {CardsFacadeService} from '@services/cards-facade.service';
import {ReplaysState} from '../../../models/mainwindow/replays/replays-state';
import {GameStat} from '../../../models/mainwindow/stats/game-stat';
import {StatsState} from '../../../models/mainwindow/stats/stats-state';
import {PreferencesService} from '../../preferences.service';

@Injectable()
export class ReplaysStateBuilderService {
    constructor(private readonly prefs: PreferencesService, private readonly allCards: CardsFacadeService) {
    }

    public async buildState(replayState: ReplaysState, stats: StatsState): Promise<ReplaysState> {
        if (!stats || !stats.gameStats || !stats.gameStats.stats) {
            console.error('Could not build replay state from empty stats', stats);
            return replayState;
        }
        const allReplays: readonly GameStat[] = [...stats.gameStats.stats];
        const state = Object.assign(new ReplaysState(), replayState, {
            allReplays: allReplays,
            isLoading: false,
        } as ReplaysState);
        return state;
    }
}
