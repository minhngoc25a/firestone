import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {OverwolfService} from '../../../services/overwolf.service';
import {PreferencesService} from '../../../services/preferences.service';

declare let amplitude;

@Component({
    selector: 'decktracker-widget-icon',
    styleUrls: [
        '../../../../css/global/components-global.scss',
        '../../../../css/component/decktracker/overlay/decktracker-widget-icon.component.scss',
        `../../../../css/themes/decktracker-theme.scss`,
    ],
    template: `
		<div class="decktracker-widget" [ngClass]="{ 'big': big }" (mouseup)="toggleDecktracker($event)">
			<div class="icon idle"></div>
			<div class="icon active"></div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecktrackerWidgetIconComponent implements AfterViewInit {
    @Output() decktrackerToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
    big: boolean;
    private windowId: string;
    private draggingTimeout;
    private isDragging: boolean;
    private isDebounce: boolean;

    constructor(private prefs: PreferencesService, private ow: OverwolfService) {
    }

    _decktrackerToggled = true;

    @Input() set decktrackerToggled(value: boolean) {
        this._decktrackerToggled = value;
        this.isDebounce = true;
        setTimeout(() => (this.isDebounce = false), 200);
    }

    async ngAfterViewInit() {
        this.windowId = (await this.ow.getCurrentWindow()).id;
    }

    toggleDecktracker(event: MouseEvent) {
        if (this.isDragging || this.isDebounce) {
            return;
        }
        amplitude.getInstance().logEvent('decktracker-widget-toggle');
        this.big = true;
        setTimeout(() => (this.big = false), 200);
        this._decktrackerToggled = !this._decktrackerToggled;
        this.decktrackerToggle.next(this._decktrackerToggled);
    }
}
