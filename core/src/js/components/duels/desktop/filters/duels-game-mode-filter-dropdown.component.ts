import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
} from '@angular/core';
import {IOption} from 'ng-select';
import {Observable} from 'rxjs';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {DuelsGameModeFilterType} from '../../../../models/duels/duels-game-mode-filter.type';
import {LocalizationFacadeService} from '../../../../services/localization-facade.service';
import {
    DuelsGameModeFilterSelectedEvent
} from '../../../../services/mainwindow/store/events/duels/duels-game-mode-filter-selected-event';
import {MainWindowStoreEvent} from '../../../../services/mainwindow/store/events/main-window-store-event';
import {OverwolfService} from '../../../../services/overwolf.service';
import {AppUiStoreFacadeService} from '../../../../services/ui-store/app-ui-store-facade.service';
import {cdLog} from '../../../../services/ui-store/app-ui-store.service';
import {AbstractSubscriptionComponent} from '../../../abstract-subscription.component';

@Component({
    selector: 'duels-game-mode-filter-dropdown',
    styleUrls: [
        `../../../../../css/global/filters.scss`,
        `../../../../../css/component/app-section.component.scss`,
        `../../../../../css/component/filter-dropdown.component.scss`,
    ],
    template: `
		<filter-dropdown
			*ngIf="filter$ | async as value"
			class="duels-game-mode-filter-dropdown"
			[options]="options"
			[filter]="value.filter"
			[placeholder]="value.placeholder"
			[visible]="value.visible"
			(onOptionSelected)="onSelected($event)"
		></filter-dropdown>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsGameModeFilterDropdownComponent
    extends AbstractSubscriptionComponent
    implements AfterContentInit, AfterViewInit {
    options: readonly GameModeFilterOption[];

    filter$: Observable<{ filter: string; placeholder: string; visible: boolean }>;

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
        this.options = [
            {
                value: 'all',
                label: this.i18n.translateString('app.duels.filters.game-mode.all'),
                tooltip: this.i18n.translateString('app.duels.filters.game-mode.all-tooltip'),
            } as GameModeFilterOption,
            {
                value: 'duels',
                label: this.i18n.translateString('app.duels.filters.game-mode.casual'),
                tooltip: this.i18n.translateString('app.duels.filters.game-mode.casual-tooltip'),
            } as GameModeFilterOption,
            {
                value: 'paid-duels',
                label: this.i18n.translateString('app.duels.filters.game-mode.heroic'),
            } as GameModeFilterOption,
        ] as readonly GameModeFilterOption[];
        this.filter$ = this.store
            .listen$(
                ([main, nav, prefs]) => prefs.duelsActiveGameModeFilter,
                ([main, nav]) => nav.navigationDuels.selectedCategoryId,
            )
            .pipe(
                filter(([filter, selectedCategoryId]) => !!filter && !!selectedCategoryId),
                map(([filter, selectedCategoryId]) => ({
                    filter: filter,
                    placeholder: this.options.find((option) => option.value === filter)?.label,
                    visible: [
                        'duels-stats',
                        'duels-runs',
                        'duels-treasures',
                        'duels-personal-decks',
                        'duels-personal-deck-details',
                    ].includes(selectedCategoryId),
                })),
                // Don't know why this is necessary, but without it, the filter doesn't update
                tap((filter) => setTimeout(() => this.cdr.detectChanges(), 0)),
                tap((filter) => cdLog('emitting filter in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
    }

    ngAfterViewInit() {
        this.stateUpdater = this.ow.getMainWindow().mainWindowStoreUpdater;
    }

    onSelected(option: GameModeFilterOption) {
        this.stateUpdater.next(new DuelsGameModeFilterSelectedEvent(option.value));
    }
}

interface GameModeFilterOption extends IOption {
    value: DuelsGameModeFilterType;
    tooltip?: string;
}
