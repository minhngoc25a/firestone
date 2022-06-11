import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewRef,
} from '@angular/core';
import {IOption} from 'ng-select';
import {MainWindowState} from '../models/mainwindow/main-window-state';
import {NavigationState} from '../models/mainwindow/navigation/navigation-state';

@Component({
    selector: 'fs-filter-dropdown',
    styleUrls: [`../../css/component/fs-filter-dropdown.component.scss`],
    template: `
		<filter-dropdown
			class="hero-sort-filter"
			[ngClass]="{ 'visible': visible }"
			[options]="_options"
			[filter]="filter"
			[placeholder]="placeholder"
			[visible]="visible"
			(onOptionSelected)="onSelected($event)"
		></filter-dropdown>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterDropdownComponent {
    @Output() onOptionSelected: EventEmitter<IOption> = new EventEmitter<IOption>();

    @Input() filter: string;
    @Input() placeholder: string;
    visible: boolean;

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    _state: any;

    @Input() set state(value: any) {
        this._state = value;
        this.doSetValues();
    }

    _navigation: NavigationState;

    @Input() set navigation(value: NavigationState) {
        this._navigation = value;
        this.doSetValues();
    }

    // Can be init directly, or through the builder
    _options: readonly IOption[] = [];

    @Input() set options(value: readonly IOption[]) {
        this._options = value;
        this.doSetValues();
    }

    _optionsBuilder: (navigation: NavigationState, state: any) => readonly IOption[];

    @Input() set optionsBuilder(value: (navigation: NavigationState, state: MainWindowState) => readonly IOption[]) {
        // this._options = undefined;
        this._optionsBuilder = value;
        this.doSetValues();
    }

    _checkVisibleHandler: (navigation: NavigationState, state: any) => boolean;

    @Input() set checkVisibleHandler(value: (navigation: NavigationState, state: MainWindowState) => boolean) {
        this._checkVisibleHandler = value;
        this.doSetValues();
    }

    onSelected(option: IOption) {
        this.onOptionSelected.next(option);
    }

    private doSetValues() {
        this.visible = this._checkVisibleHandler ? this._checkVisibleHandler(this._navigation, this._state) : true;
        if (!this.visible) {
            return;
        }

        // We want to rebuild it in case the option contents change (eg the last patch number is retrieved,
        // or in case the options values depend on another selection)
        this._options = this._optionsBuilder ? this._optionsBuilder(this._navigation, this._state) : this._options;
        const placeholder =
            this._options && this._options.length > 0 && this.filter
                ? this._options.find((option) => option.value === this.filter)?.label
                : this.placeholder;
        this.placeholder = placeholder ?? this.placeholder;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }
}
