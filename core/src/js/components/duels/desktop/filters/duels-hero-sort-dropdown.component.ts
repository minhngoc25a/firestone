import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { IOption } from 'ng-select';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DuelsHeroSortFilterType } from '../../../../models/duels/duels-hero-sort-filter.type';
import { AppUiStoreService } from '../../../../services/app-ui-store.service';
import { DuelsHeroSortFilterSelectedEvent } from '../../../../services/mainwindow/store/events/duels/duels-hero-sort-filter-selected-event';
import { MainWindowStoreEvent } from '../../../../services/mainwindow/store/events/main-window-store-event';
import { OverwolfService } from '../../../../services/overwolf.service';

@Component({
	selector: 'duels-hero-sort-dropdown',
	styleUrls: [
		`../../../../../css/global/filters.scss`,
		`../../../../../css/component/app-section.component.scss`,
		`../../../../../css/component/filter-dropdown.component.scss`,
	],
	template: `
		<filter-dropdown
			*ngIf="filter$ | async as value"
			class="duels-hero-filter-dropdown"
			[options]="options"
			[filter]="value.filter"
			[placeholder]="value.placeholder"
			[visible]="value.visible"
			(onOptionSelected)="onSelected($event)"
		></filter-dropdown>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsHeroSortDropdownComponent implements AfterViewInit {
	options: readonly HeroSortFilterOption[];

	filter$: Observable<{ filter: string; placeholder: string; visible: boolean }>;

	private stateUpdater: EventEmitter<MainWindowStoreEvent>;

	constructor(private readonly ow: OverwolfService, private readonly store: AppUiStoreService) {
		this.options = [
			{
				value: 'player-winrate',
				label: 'Your winrate',
			} as HeroSortFilterOption,
			{
				value: 'global-winrate',
				label: 'Global winrate',
			} as HeroSortFilterOption,
			{
				value: 'games-played',
				label: 'Games played',
			} as HeroSortFilterOption,
		] as readonly HeroSortFilterOption[];
		this.filter$ = this.store
			.listen$(
				([main, nav]) => main.duels.activeHeroSortFilter,
				([main, nav]) => nav.navigationDuels.selectedCategoryId,
			)
			.pipe(
				filter(([filter, selectedCategoryId]) => !!filter && !!selectedCategoryId),
				map(([filter, selectedCategoryId]) => ({
					filter: filter,
					placeholder: this.options.find((option) => option.value === filter)?.label,
					visible: ['duels-stats'].includes(selectedCategoryId),
				})),
				// tap((filter) => cdLog('emitting filter in ', this.constructor.name, filter)),
			);
	}

	ngAfterViewInit() {
		this.stateUpdater = this.ow.getMainWindow().mainWindowStoreUpdater;
	}

	onSelected(option: HeroSortFilterOption) {
		this.stateUpdater.next(new DuelsHeroSortFilterSelectedEvent(option.value));
	}
}

interface HeroSortFilterOption extends IOption {
	value: DuelsHeroSortFilterType;
}