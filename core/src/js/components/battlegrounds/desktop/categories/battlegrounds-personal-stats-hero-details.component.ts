import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    ViewRef,
} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {BgsPlayer} from '../../../../models/battlegrounds/bgs-player';
import {BgsHeroStat} from '../../../../models/battlegrounds/stats/bgs-hero-stat';
import {
    BattlegroundsPersonalStatsHeroDetailsCategory
} from '../../../../models/mainwindow/battlegrounds/categories/battlegrounds-personal-stats-hero-details-category';
import {BgsHeroStatsFilterId} from '../../../../models/mainwindow/battlegrounds/categories/bgs-hero-stats-filter-id';
import {LocalizationFacadeService} from '../../../../services/localization-facade.service';
import {
    SelectBattlegroundsPersonalStatsHeroTabEvent
} from '../../../../services/mainwindow/store/events/battlegrounds/select-battlegrounds-personal-stats-hero-event';
import {MainWindowStoreEvent} from '../../../../services/mainwindow/store/events/main-window-store-event';
import {OverwolfService} from '../../../../services/overwolf.service';
import {AppUiStoreFacadeService} from '../../../../services/ui-store/app-ui-store-facade.service';
import {cdLog, currentBgHeroId} from '../../../../services/ui-store/app-ui-store.service';
import {arraysEqual} from '../../../../services/utils';
import {AbstractSubscriptionComponent} from '../../../abstract-subscription.component';

@Component({
    selector: 'battlegrounds-personal-stats-hero-details',
    styleUrls: [
        `../../../../../css/component/battlegrounds/desktop/categories/battlegrounds-personal-stats-hero-details.component.scss`,
        `../../../../../css/global/components-global.scss`,
    ],
    template: `
		<div class="battlegrounds-personal-stats-hero-details">
			<bgs-player-capsule [player]="player$ | async" [displayTavernTier]="false">
				<bgs-hero-detailed-stats> </bgs-hero-detailed-stats>
			</bgs-player-capsule>
			<div class="stats" *ngIf="selectedTab$ | async as selectedTab">
				<ul class="tabs">
					<li
						*ngFor="let tab of tabs$ | async"
						class="tab"
						[ngClass]="{ 'active': tab === selectedTab }"
						(mousedown)="selectTab(tab)"
					>
						{{ getLabel(tab) }}
					</li>
				</ul>
				<bgs-last-warbands class="stat" *ngIf="selectedTab === 'final-warbands'"> </bgs-last-warbands>
				<bgs-mmr-evolution-for-hero class="stat" *ngIf="selectedTab === 'mmr'"> </bgs-mmr-evolution-for-hero>
				<bgs-warband-stats-for-hero class="stat" *ngIf="selectedTab === 'warband-stats'">
				</bgs-warband-stats-for-hero>
				<bgs-winrate-stats-for-hero class="stat" *ngIf="selectedTab === 'winrate-stats'">
				</bgs-winrate-stats-for-hero>
			</div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundsPersonalStatsHeroDetailsComponent
    extends AbstractSubscriptionComponent
    implements AfterContentInit, AfterViewInit {
    tabs$: Observable<readonly BgsHeroStatsFilterId[]>;
    selectedTab$: Observable<BgsHeroStatsFilterId>;
    player$: Observable<BgsPlayer>;

    private stateUpdater: EventEmitter<MainWindowStoreEvent>;

    constructor(
        private readonly ow: OverwolfService,
        private readonly i18n: LocalizationFacadeService,
        protected readonly store: AppUiStoreFacadeService,
        protected readonly cdr: ChangeDetectorRef,
    ) {
        super(store, cdr);
    }

    ngAfterContentInit() {
        this.tabs$ = this.store
            .listen$(
                ([main, nav]) => main.battlegrounds,
                ([main, nav]) => nav.navigationBattlegrounds.selectedCategoryId,
            )
            .pipe(
                map(([battlegrounds, selectedCategoryId]) => battlegrounds.findCategory(selectedCategoryId)),
                filter((category) => !!category && !!(category as BattlegroundsPersonalStatsHeroDetailsCategory).tabs),
                map((category) => (category as BattlegroundsPersonalStatsHeroDetailsCategory).tabs),
                distinctUntilChanged((a, b) => arraysEqual(a, b)),
                tap((stat) => cdLog('emitting tabs in ', this.constructor.name, stat)),
                takeUntil(this.destroyed$),
            );
        this.selectedTab$ = this.store
            .listen$(([main, nav]) => nav.navigationBattlegrounds.selectedPersonalHeroStatsTab)
            .pipe(
                filter(([tab]) => !!tab),
                this.mapData(([tab]) => tab),
            );
        this.player$ = combineLatest(
            this.store.bgHeroStats$(),
            this.store.listen$(
                ([main, nav]) => main.battlegrounds,
                ([main, nav]) => nav.navigationBattlegrounds.selectedCategoryId,
            ),
        ).pipe(
            map(
                ([heroStats, [battlegrounds, selectedCategoryId]]) =>
                    [heroStats, currentBgHeroId(battlegrounds, selectedCategoryId)] as [BgsHeroStat[], string],
            ),
            filter(([heroStats, heroId]) => !!heroStats && !!heroId),
            map(([heroStats, heroId]) => heroStats?.find((stat) => stat.id === heroId)),
            distinctUntilChanged(),
            map((heroStat) =>
                BgsPlayer.create({
                    cardId: heroStat.id,
                    displayedCardId: heroStat.id,
                    heroPowerCardId: heroStat.heroPowerCardId,
                } as BgsPlayer),
            ),
            // FIXME
            tap((filter) =>
                setTimeout(() => {
                    if (!(this.cdr as ViewRef)?.destroyed) {
                        this.cdr.detectChanges();
                    }
                }, 0),
            ),
            tap((stat) => cdLog('emitting player in ', this.constructor.name, stat)),
            takeUntil(this.destroyed$),
        );
    }

    ngAfterViewInit() {
        this.stateUpdater = this.ow.getMainWindow().mainWindowStoreUpdater;
    }

    getLabel(tab: BgsHeroStatsFilterId) {
        return this.i18n.translateString(`app.battlegrounds.personal-stats.hero-details.tabs.${tab}`);
    }

    selectTab(tab: BgsHeroStatsFilterId) {
        this.stateUpdater.next(new SelectBattlegroundsPersonalStatsHeroTabEvent(tab));
    }
}
