import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {BoosterType} from '@firestone-hs/reference-data';
import {PackResult} from '@firestone-hs/user-packs';
import {combineLatest, Observable} from 'rxjs';
import {PackInfo} from '../../models/collection/pack-info';
import {boosterIdToBoosterName, getPackDustValue} from '../../services/hs-utils';
import {LocalizationFacadeService} from '../../services/localization-facade.service';
import {AppUiStoreFacadeService} from '../../services/ui-store/app-ui-store-facade.service';
import {sumOnArray} from '../../services/utils';
import {AbstractSubscriptionComponent} from '../abstract-subscription.component';

@Component({
    selector: 'pack-stats',
    styleUrls: [`../../../css/global/scrollbar.scss`, `../../../css/component/collection/pack-stats.component.scss`],
    template: `
		<div class="pack-stats" scrollable>
			<div class="header">
				{{ 'app.collection.pack-stats.title' | owTranslate: { value: totalPacks$ | async } }}
				<preference-toggle
					class="show-buyable-packs"
					[ngClass]="{ 'active': showOnlyBuyablePacks$ | async }"
					field="collectionShowOnlyBuyablePacks"
					[label]="'settings.collection.pack-stats-show-only-buyable-packs' | owTranslate"
					[helpTooltip]="'settings.collection.pack-stats-show-only-buyable-packs-tooltip' | owTranslate"
				></preference-toggle>
			</div>
			<div
				class="packs-container"
				*ngIf="{ packs: packs$ | async } as value"
				[ngClass]="{ 'empty': !value.packs?.length }"
			>
				<div
					class="pack-stat"
					*ngFor="let pack of value.packs; trackBy: trackByPackFn"
					[ngClass]="{ 'missing': !pack.totalObtained }"
				>
					<div
						class="icon-container"
						[style.width.px]="cardWidth"
						[style.height.px]="cardHeight"
						[helpTooltip]="
							'app.collection.pack-stats.pack-stat-tooltip'
								| owTranslate: { totalPacks: pack.totalObtained, packName: pack.name }
						"
					>
						<img
							class="icon"
							[src]="'https://static.firestoneapp.com/cardPacks/256/' + pack.packType + '.png?v=4'"
						/>
					</div>
					<div class="value">{{ pack.totalObtained }}</div>
				</div>
			</div>
			<ng-container *ngIf="{ bestPacks: bestPacks$ | async } as value">
				<div
					class="header best-packs-header"
					*ngIf="value.bestPacks?.length"
					[helpTooltip]="'app.collection.pack-stats.best-opened-packs-title-tooltip' | owTranslate"
					[owTranslate]="'app.collection.pack-stats.best-opened-packs-title'"
					[translateParams]="{ value: value.bestPacks.length }"
				></div>
				<div class="best-packs-container" *ngIf="value.bestPacks?.length">
					<div class="best-pack" *ngFor="let pack of value.bestPacks">
						<pack-history-item class="info" [historyItem]="pack"></pack-history-item>
						<pack-display class="display" [pack]="pack"></pack-display>
					</div>
				</div>
			</ng-container>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPackStatsComponent extends AbstractSubscriptionComponent implements AfterContentInit {
    readonly DEFAULT_CARD_WIDTH = 115;
    readonly DEFAULT_CARD_HEIGHT = 155;

    totalPacks$: Observable<number>;
    showOnlyBuyablePacks$: Observable<boolean>;
    packs$: Observable<readonly InternalPackInfo[]>;
    bestPacks$: Observable<readonly PackResult[]>;

    cardWidth = this.DEFAULT_CARD_WIDTH;
    cardHeight = this.DEFAULT_CARD_HEIGHT;

    constructor(
        private readonly i18n: LocalizationFacadeService,
        protected readonly store: AppUiStoreFacadeService,
        protected readonly cdr: ChangeDetectorRef,
    ) {
        super(store, cdr);
    }

    async ngAfterContentInit() {
        this.showOnlyBuyablePacks$ = this.listenForBasicPref$((prefs) => prefs.collectionShowOnlyBuyablePacks);
        this.packs$ = combineLatest(
            this.showOnlyBuyablePacks$,
            this.store.listen$(([main, nav, prefs]) => main.binder.packs),
        ).pipe(
            this.mapData(([showOnlyBuyablePacks, [inputPacks]]) =>
                Object.values(BoosterType)
                    .filter((boosterId: BoosterType) => !isNaN(boosterId))
                    .filter((boosterId: BoosterType) => !EXCLUDED_BOOSTER_IDS.includes(boosterId))
                    .filter(
                        (boosterId: BoosterType) =>
                            !showOnlyBuyablePacks || !NON_BUYABLE_BOOSTER_IDS.includes(boosterId),
                    )
                    .map((boosterId: BoosterType) => ({
                        packType: boosterId,
                        totalObtained: inputPacks.find((p) => p.packType === boosterId)?.totalObtained ?? 0,
                        unopened: 0,
                        name: boosterIdToBoosterName(boosterId, this.i18n),
                    }))
                    .filter((info) => info)
                    .reverse(),
            ),
        );
        this.totalPacks$ = this.packs$.pipe(this.mapData((packs) => sumOnArray(packs, (pack) => pack.totalObtained)));
        this.bestPacks$ = this.store
            .listen$(([main, nav, prefs]) => main.binder.packStats)
            .pipe(
                this.mapData(([packStats]) =>
                    [...packStats].sort((a, b) => getPackDustValue(b) - getPackDustValue(a)).slice(0, 5),
                ),
            );
    }

    trackByPackFn(index: number, item: InternalPackInfo) {
        return item.packType;
    }
}

const EXCLUDED_BOOSTER_IDS = [
    BoosterType.INVALID,
    BoosterType.SIGNUP_INCENTIVE,
    BoosterType.FIRST_PURCHASE,
    BoosterType.FIRST_PURCHASE_OLD,
    BoosterType.MAMMOTH_BUNDLE,
    BoosterType.WAILING_CAVERNS,
];

const NON_BUYABLE_BOOSTER_IDS = [
    BoosterType.INVALID,
    BoosterType.FIRST_PURCHASE_OLD,
    BoosterType.FIRST_PURCHASE,
    BoosterType.SIGNUP_INCENTIVE,
    BoosterType.GOLDEN_CLASSIC_PACK,
    BoosterType.GOLDEN_SCHOLOMANCE,
    BoosterType.GOLDEN_DARKMOON_FAIRE,
    BoosterType.GOLDEN_THE_BARRENS,
    BoosterType.GOLDEN_STORMWIND,
    BoosterType.MAMMOTH_BUNDLE,
    BoosterType.YEAR_OF_DRAGON,
    BoosterType.YEAR_OF_PHOENIX,
    BoosterType.STANDARD_DEMONHUNTER,
    BoosterType.STANDARD_DRUID,
    BoosterType.STANDARD_HUNTER,
    BoosterType.STANDARD_MAGE,
    BoosterType.STANDARD_PALADIN,
    BoosterType.STANDARD_PRIEST,
    BoosterType.STANDARD_ROGUE,
    BoosterType.STANDARD_SHAMAN,
    BoosterType.STANDARD_WARRIOR,
    BoosterType.STANDARD_WARLOCK,
    BoosterType.STANDARD_BUNDLE,
    BoosterType.GOLDEN_STANDARD_BUNDLE,
    BoosterType.WILD_PACK,
];

interface InternalPackInfo extends PackInfo {
    readonly name: string;
}
