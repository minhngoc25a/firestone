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
import {DuelsTimeFilterType} from '../../../../models/duels/duels-time-filter.type';
import {LocalizationFacadeService} from '../../../../services/localization-facade.service';
import {
    DuelsTimeFilterSelectedEvent
} from '../../../../services/mainwindow/store/events/duels/duels-time-filter-selected-event';
import {MainWindowStoreEvent} from '../../../../services/mainwindow/store/events/main-window-store-event';
import {OverwolfService} from '../../../../services/overwolf.service';
import {AppUiStoreFacadeService} from '../../../../services/ui-store/app-ui-store-facade.service';
import {formatPatch} from '../../../../services/utils';
import {AbstractSubscriptionComponent} from '../../../abstract-subscription.component';

@Component({
    selector: 'duels-time-filter-dropdown',
    styleUrls: [
        `../../../../../css/global/filters.scss`,
        `../../../../../css/component/app-section.component.scss`,
        `../../../../../css/component/filter-dropdown.component.scss`,
    ],
    template: `
		<filter-dropdown
			*ngIf="filter$ | async as value"
			class="duels-time-filter-dropdown"
			[options]="value.options"
			[filter]="value.filter"
			[placeholder]="value.placeholder"
			[visible]="value.visible"
			(onOptionSelected)="onSelected($event)"
		></filter-dropdown>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsTimeFilterDropdownComponent
    extends AbstractSubscriptionComponent
    implements AfterContentInit, AfterViewInit {
    filter$: Observable<{ filter: string; options: readonly IOption[]; placeholder: string; visible: boolean }>;

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
        this.filter$ = this.store
            .listen$(
                ([main, nav, prefs]) => prefs.duelsActiveTimeFilter,
                ([main, nav]) => nav.navigationDuels.selectedCategoryId,
                ([main, nav]) => main.duels.currentDuelsMetaPatch,
            )
            .pipe(
                filter(([filter, selectedCategoryId, patch]) => !!filter && !!selectedCategoryId && !!patch),
                map(([filter, selectedCategoryId, patch]) => {
                    const options = [
                        {
                            value: 'all-time',
                            label: this.i18n.translateString('app.duels.filters.time.past-100'),
                        } as TimeFilterOption,
                        {
                            value: 'last-patch',
                            label: this.i18n.translateString('app.duels.filters.time.last-patch'),
                            tooltip: formatPatch(patch, this.i18n),
                        } as TimeFilterOption,
                        {
                            value: 'past-seven',
                            label: this.i18n.translateString('app.duels.filters.time.past-seven'),
                        } as TimeFilterOption,
                        {
                            value: 'past-three',
                            label: this.i18n.translateString('app.duels.filters.time.past-three'),
                        } as TimeFilterOption,
                    ] as readonly TimeFilterOption[];
                    return {
                        filter: filter,
                        placeholder: options.find((option) => option.value === filter)?.label,
                        visible: [
                            'duels-stats',
                            'duels-runs',
                            'duels-personal-decks',
                            'duels-personal-deck-details',
                            'duels-top-decks',
                            'duels-treasures',
                        ].includes(selectedCategoryId),
                        options: options,
                    };
                }),
                // Don't know why this is necessary, but without it, the filter doesn't update
                tap((filter) => setTimeout(() => this.cdr.detectChanges(), 0)),
                // tap((filter) => cdLog('emitting filter in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
    }

    ngAfterViewInit() {
        this.stateUpdater = this.ow.getMainWindow().mainWindowStoreUpdater;
    }

    onSelected(option: TimeFilterOption) {
        this.stateUpdater.next(new DuelsTimeFilterSelectedEvent(option.value));
    }
}

interface TimeFilterOption extends IOption {
    value: DuelsTimeFilterType;
}
