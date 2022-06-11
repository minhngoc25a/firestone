/* eslint-disable @typescript-eslint/no-use-before-define */
import {Injectable} from '@angular/core';
import {GameFormat} from '@firestone-hs/reference-data';
import {DeckDefinition, decode} from 'deckstrings';
import {DeckFilters} from '../../../models/mainwindow/decktracker/deck-filters';
import {DeckRankFilterType} from '../../../models/mainwindow/decktracker/deck-rank-filter.type';
import {DeckSummary} from '../../../models/mainwindow/decktracker/deck-summary';
import {DeckTimeFilterType} from '../../../models/mainwindow/decktracker/deck-time-filter.type';
import {GameStat} from '../../../models/mainwindow/stats/game-stat';
import {MatchupStat} from '../../../models/mainwindow/stats/matchup-stat';
import {StatGameFormatType} from '../../../models/mainwindow/stats/stat-game-format.type';
import {StatsState} from '../../../models/mainwindow/stats/stats-state';
import {PatchInfo} from '../../../models/patches';
import {Preferences} from '../../../models/preferences';
import {classes} from '../../hs-utils';
import {groupByFunction} from '../../utils';

@Injectable()
export class DecksStateBuilderService {
    public static isValidDate(stat: GameStat, timeFilter: DeckTimeFilterType, lastPatch: PatchInfo): boolean {
        const now = Date.now();
        switch (timeFilter) {
            case 'season-start':
                const startOfMonthDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                return stat.creationTimestamp >= startOfMonthDate.getTime();
            case 'last-patch':
                // See bgs-ui-helper
                return (
                    stat.buildNumber >= lastPatch.number ||
                    stat.creationTimestamp > new Date(lastPatch.date).getTime() + 24 * 60 * 60 * 1000
                );
            case 'past-30':
                const past30Date = new Date(now - 30 * 24 * 60 * 60 * 1000);
                // Season starts always in Bronze
                return stat.creationTimestamp >= past30Date.getTime();
            case 'past-7':
                const past7Date = new Date(now - 7 * 24 * 60 * 60 * 1000);
                // Season starts always in Bronze
                return stat.creationTimestamp >= past7Date.getTime();
            case 'past-1':
                const past1Date = new Date(now - 1 * 24 * 60 * 60 * 1000);
                // Season starts always in Bronze
                return stat.creationTimestamp >= past1Date.getTime();
            case 'all-time':
            default:
                return true;
        }
    }

    public buildState(
        stats: StatsState,
        filters: DeckFilters,
        patch: PatchInfo,
        prefs: Preferences = null,
    ): readonly DeckSummary[] {
        // TODO: move applying prefs to UI. We don't need to recompute all matchups for all decks whenever we finish one game
        if (!stats || !stats.gameStats?.stats?.length) {
            return [];
        }
        const rankedStats = stats.gameStats.stats
            .filter((stat) => stat.gameMode === 'ranked')
            .filter((stat) => !!stat.playerDecklist);
        const statsByDeck = groupByFunction((stat: GameStat) => stat.playerDecklist)(rankedStats);
        // const validReplays = this.buildValidReplays(statsByDeck[deckstring], filters, prefs, patch);
        const deckstrings = Object.keys(statsByDeck);
        const decks: readonly DeckSummary[] = deckstrings.map((deckstring) =>
            this.buildDeckSummary(
                deckstring,
                this.buildValidReplays(statsByDeck[deckstring], filters, prefs, patch),
                prefs,
                statsByDeck[deckstring][0],
            ),
        );

        // .sort(this.getSortFunction(filters.sort));

        return decks;
    }

    // private getSortFunction(sort: DeckSortType): (a: DeckSummary, b: DeckSummary) => number {
    // 	switch (sort) {
    // 		case 'games-played':
    // 			return (a: DeckSummary, b: DeckSummary) => {
    // 				if (a.totalGames <= b.totalGames) {
    // 					return 1;
    // 				}
    // 				return -1;
    // 			};
    // 		case 'winrate':
    // 			return (a: DeckSummary, b: DeckSummary) => {
    // 				if (a.winRatePercentage <= b.winRatePercentage) {
    // 					return 1;
    // 				}
    // 				return -1;
    // 			};
    // 		case 'last-played':
    // 		default:
    // 			return (a: DeckSummary, b: DeckSummary) => {
    // 				if (a.lastUsedTimestamp <= b.lastUsedTimestamp) {
    // 					return 1;
    // 				}
    // 				return -1;
    // 			};
    // 	}
    // }

    private buildValidReplays(
        stats: readonly GameStat[],
        filters: DeckFilters,
        prefs: Preferences,
        patch: PatchInfo,
    ): readonly GameStat[] {
        const replaysForDate = stats
            // We have to also filter the info here, as otherwise we need to do a full state reset
            // after the user presses the delete button
            .filter(
                (stat) =>
                    !prefs?.desktopDeckDeletes ||
                    !prefs.desktopDeckDeletes[stat.playerDecklist]?.length ||
                    prefs.desktopDeckDeletes[stat.playerDecklist][0] < stat.creationTimestamp,
            )
            .filter((stat) => filters.gameFormat === 'all' || stat.gameFormat === filters.gameFormat)
            .filter((stat) => stat.gameMode === filters.gameMode)
            .filter((stat) => DecksStateBuilderService.isValidDate(stat, filters.time, patch));
        // Make sure that if the current filter is "season-start", the first game starts in Bronze
        let indexOfFirstGame = replaysForDate.length;
        if (filters.time === 'season-start') {
            for (let i = replaysForDate.length - 1; i >= 0; i--) {
                if (replaysForDate[i]?.playerRank?.includes('5-')) {
                    indexOfFirstGame = i;
                    break;
                }
            }
        }
        const hiddenDeckCodes = prefs?.desktopDeckHiddenDeckCodes ?? [];
        return replaysForDate
            .slice(0, indexOfFirstGame + 1)
            .filter((stat) => this.isValidRank(stat, filters.rank))
            .filter((stat) => stat.playerDecklist && stat.playerDecklist !== 'undefined')
            .filter(
                (stat) => !prefs || prefs.desktopDeckShowHiddenDecks || !hiddenDeckCodes.includes(stat.playerDecklist),
            );
    }

    private isValidRank(stat: GameStat, rankFilter: DeckRankFilterType): boolean {
        const legendRank =
            stat.playerRank && stat.playerRank.indexOf('legend-') > -1
                ? parseInt(stat.playerRank.split('legend-')[1])
                : null;
        const leagueId =
            !legendRank && stat.playerRank && stat.playerRank.indexOf('-') > -1
                ? parseInt(stat.playerRank.split('-')[0])
                : null;
        switch (rankFilter) {
            case 'silver':
                return legendRank != null || (leagueId && leagueId <= 4);
            case 'gold':
                return legendRank != null || (leagueId && leagueId <= 3);
            case 'platinum':
                return legendRank != null || (leagueId && leagueId <= 2);
            case 'diamond':
                return legendRank != null || (leagueId && leagueId <= 1);
            case 'legend':
                return legendRank != null;
            case 'legend-500':
                return legendRank != null && legendRank <= 500;
            case 'all':
            default:
                return true;
        }
    }

    private buildDeckSummary(
        deckstring: string,
        stats: readonly GameStat[],
        prefs: Preferences,
        sampleGame?: GameStat,
    ): DeckSummary {
        const statsWithReset = stats.filter(
            (stat) =>
                !prefs?.desktopDeckStatsReset ||
                !prefs.desktopDeckStatsReset[stat.playerDecklist]?.length ||
                prefs.desktopDeckStatsReset[stat.playerDecklist][0] < stat.creationTimestamp,
        );

        const deckName =
            stats.filter((stat) => stat.playerDeckName).length > 0
                ? stats.filter((stat) => stat.playerDeckName)[0].playerDeckName
                : sampleGame?.playerDeckName;
        const deckArchetype =
            stats.filter((stat) => stat.playerArchetypeId).length > 0
                ? stats.filter((stat) => stat.playerArchetypeId)[0].playerArchetypeId
                : sampleGame?.playerArchetypeId;
        const deckSkin =
            stats.filter((stat) => stat.playerCardId).length > 0
                ? stats.filter((stat) => stat.playerCardId)[0].playerCardId
                : sampleGame?.playerCardId;
        const deckClass =
            stats.filter((stat) => stat.playerClass).length > 0
                ? stats.filter((stat) => stat.playerClass)[0].playerClass
                : sampleGame?.playerClass;
        const totalGames = statsWithReset.length;
        const totalWins = statsWithReset.filter((stat) => stat.result === 'won').length;
        const lastUsed = statsWithReset.filter((stat) => stat.creationTimestamp)?.length
            ? statsWithReset.filter((stat) => stat.creationTimestamp)[0]?.creationTimestamp
            : stats.filter((stat) => stat.creationTimestamp)?.length
                ? stats.filter((stat) => stat.creationTimestamp)[0]?.creationTimestamp
                : undefined;
        const matchupStats: readonly MatchupStat[] = this.buildMatchupStats(statsWithReset);
        let decodedDeckName: string = null;
        try {
            decodedDeckName = decodeURIComponent(deckName);
        } catch (e) {
            console.error('Could not decode deck name', deckName, e);
        }
        return Object.assign(new DeckSummary(), {
            class: deckClass,
            deckName: decodedDeckName,
            deckArchetype: deckArchetype,
            deckstring: deckstring,
            lastUsedTimestamp: lastUsed,
            skin: deckSkin,
            totalGames: totalGames,
            winRatePercentage: totalGames > 0 ? (100.0 * totalWins) / totalGames : null,
            hidden: prefs.desktopDeckHiddenDeckCodes.includes(deckstring),
            matchupStats: matchupStats,
            format: this.buildFormat(deckstring),
            replays: statsWithReset,
        } as DeckSummary);
    }

    private buildFormat(deckstring: string): StatGameFormatType {
        const deckInfo: DeckDefinition = decode(deckstring);
        switch (deckInfo.format) {
            case GameFormat.FT_CLASSIC:
                return 'classic';
            case GameFormat.FT_WILD:
                return 'wild';
            case GameFormat.FT_CLASSIC:
            default:
                return 'standard';
        }
    }

    private buildMatchupStats(stats: readonly GameStat[]): readonly MatchupStat[] {
        return classes.map((opponentClass) => {
            const games = stats.filter((stat) => stat.opponentClass?.toLowerCase() === opponentClass);
            return {
                opponentClass: opponentClass,
                totalGames: games.length,
                totalWins: games.filter((game) => game.result === 'won').length,
                totalGamesFirst: games.filter((game) => game.coinPlay === 'play').length,
                totalGamesCoin: games.filter((game) => game.coinPlay === 'coin').length,
                totalWinsFirst: games.filter((game) => game.coinPlay === 'play').filter((game) => game.result === 'won')
                    .length,
                totalWinsCoin: games.filter((game) => game.coinPlay === 'coin').filter((game) => game.result === 'won')
                    .length,
            } as MatchupStat;
        });
    }
}
