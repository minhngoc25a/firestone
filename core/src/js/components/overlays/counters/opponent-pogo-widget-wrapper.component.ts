import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Renderer2,
} from '@angular/core';
import {OverwolfService} from '../../../services/overwolf.service';
import {PreferencesService} from '../../../services/preferences.service';
import {AppUiStoreFacadeService} from '../../../services/ui-store/app-ui-store-facade.service';
import {AbstractCounterWidgetWrapperComponent, templateBase} from './abstract-counter-widget-wrapper.component';

@Component({
    selector: 'opponent-pogo-widget-wrapper',
    styleUrls: ['../../../../css/component/overlays/decktracker-player-widget-wrapper.component.scss'],
    template: templateBase,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpponentPogoWidgetWrapperComponent
    extends AbstractCounterWidgetWrapperComponent
    implements AfterContentInit {
    constructor(
        protected readonly ow: OverwolfService,
        protected readonly el: ElementRef,
        protected readonly prefs: PreferencesService,
        protected readonly renderer: Renderer2,
        protected readonly store: AppUiStoreFacadeService,
        protected readonly cdr: ChangeDetectorRef,
    ) {
        super(ow, el, prefs, renderer, store, cdr);
        this.side = 'opponent';
        this.activeCounter = 'pogo';
    }

    ngAfterContentInit(): void {
        this.prefExtractor = (prefs) => prefs.opponentPogoCounter;
        this.deckStateExtractor = (state) => state.opponentDeck?.containsPogoHopper();
        super.ngAfterContentInit();
    }
}
