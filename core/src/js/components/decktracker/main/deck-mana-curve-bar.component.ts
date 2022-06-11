import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input} from '@angular/core';
import {MainWindowStoreEvent} from '../../../services/mainwindow/store/events/main-window-store-event';
import {OverwolfService} from '../../../services/overwolf.service';
import {CardsByCost} from './cards-by-cost';

@Component({
    selector: 'deck-mana-curve-bar',
    styleUrls: [
        `../../../../css/global/components-global.scss`,
        `../../../../css/component/decktracker/main/deck-mana-curve-bar.component.scss`,
    ],
    template: `
		<div class="deck-mana-curve-bar">
			<div class="quantity">{{ _info?.quantity }}</div>
			<div class="bar">
				<!-- <div class="container"></div> -->
				<div class="fill" [style.height.%]="fillHeight"></div>
			</div>
			<div class="label">{{ _info?.label }}</div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckManaCurveBarComponent implements AfterViewInit {
    fillHeight: number;
    private stateUpdater: EventEmitter<MainWindowStoreEvent>;

    constructor(private readonly ow: OverwolfService) {
    }

    _info: CardsByCost;

    @Input() set info(value: CardsByCost) {
        this._info = value;
        this.updateValues();
    }

    _maxQuantity: number;

    @Input() set maxQuantity(value: number) {
        this._maxQuantity = value;
        this.updateValues();
    }

    ngAfterViewInit() {
        this.stateUpdater = this.ow.getMainWindow().mainWindowStoreUpdater;
    }

    private updateValues() {
        if (!this._info || !this._maxQuantity) {
            return;
        }

        this.fillHeight = (100 * this._info.quantity) / this._maxQuantity;
    }
}
