import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Renderer2,
} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {Preferences} from '../../models/preferences';
import {OverwolfService} from '../../services/overwolf.service';
import {PreferencesService} from '../../services/preferences.service';
import {AppUiStoreFacadeService} from '../../services/ui-store/app-ui-store-facade.service';
import {AbstractWidgetWrapperComponent} from './_widget-wrapper.component';

@Component({
    selector: 'current-session-widget-wrapper',
    styleUrls: ['../../../css/component/overlays/decktracker-player-widget-wrapper.component.scss'],
    template: `
		<current-session-widget
			class="widget"
			*ngIf="showWidget$ | async"
			cdkDrag
			(cdkDragStarted)="startDragging()"
			(cdkDragReleased)="stopDragging()"
			(cdkDragEnded)="dragEnded($event)"
		></current-session-widget>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentSessionWidgetWrapperComponent extends AbstractWidgetWrapperComponent implements AfterContentInit {
    showWidget$: Observable<boolean>;
    protected bounds = {
        left: -50,
        right: -50,
        top: -50,
        bottom: -50,
    };

    constructor(
        protected readonly ow: OverwolfService,
        protected readonly el: ElementRef,
        protected readonly prefs: PreferencesService,
        protected readonly renderer: Renderer2,
        protected readonly store: AppUiStoreFacadeService,
        protected readonly cdr: ChangeDetectorRef,
    ) {
        super(ow, el, prefs, renderer, store, cdr);
    }

    ngAfterContentInit(): void {
        this.showWidget$ = combineLatest(this.store.listenPrefs$((prefs) => prefs.showCurrentSessionWidgetBgs)).pipe(
            this.mapData(([[displayBgs]]) => displayBgs),
            this.handleReposition(),
        );
    }

    protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number) => gameWidth - 500;

    protected defaultPositionTopProvider = (gameWidth: number, gameHeight: number) => 10;

    protected positionUpdater = (left: number, top: number) => this.prefs.updateCurrentSessionWidgetPosition(left, top);

    protected positionExtractor = async (prefs: Preferences) => prefs.currentSessionWidgetPosition;

    protected getRect = () => this.el.nativeElement.querySelector('.widget')?.getBoundingClientRect();
}
