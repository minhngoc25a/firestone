import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Renderer2,
    ViewRef,
} from '@angular/core';
import {DungeonCrawlOptionType, SceneMode} from '@firestone-hs/reference-data';
import {combineLatest, Observable} from 'rxjs';
import {OverwolfService} from '../../services/overwolf.service';
import {PreferencesService} from '../../services/preferences.service';
import {AppUiStoreFacadeService} from '../../services/ui-store/app-ui-store-facade.service';
import {AbstractWidgetWrapperComponent} from './_widget-wrapper.component';

@Component({
    selector: 'duels-ooc-hero-power-selection-widget-wrapper',
    styleUrls: ['../../../css/component/overlays/background-widget.component.scss'],
    template: `
		<duels-ooc-hero-power-selection
			class="widget"
			*ngIf="showWidget$ | async"
			[style.width.px]="windowWidth"
			[style.height.px]="windowHeight"
		></duels-ooc-hero-power-selection>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsOutOfCombatHeroPowerSelectionWidgetWrapperComponent
    extends AbstractWidgetWrapperComponent
    implements AfterContentInit {
    showWidget$: Observable<boolean>;
    windowWidth: number;
    windowHeight: number;
    protected positionUpdater = null;
    protected positionExtractor = null;

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
        this.showWidget$ = combineLatest(
            this.store.listenPrefs$((prefs) => prefs.duelsShowInfoOnHeroSelection),
            this.store.listen$(
                ([main, prefs]) => main?.duels,
                ([main, nav]) => main.currentScene,
            ),
        ).pipe(
            this.mapData(([[displayFromPrefs], [duels, currentScene]]) => {
                return (
                    displayFromPrefs &&
                    currentScene === SceneMode.PVP_DUNGEON_RUN &&
                    duels.currentOption === DungeonCrawlOptionType.HERO_POWER
                );
            }),
            this.handleReposition(),
        );
    }

    protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number) => gameHeight * 0.2 * 0.45;

    protected defaultPositionTopProvider = (gameWidth: number, gameHeight: number) => 0.2 * gameHeight;

    protected getRect = () => this.el.nativeElement.querySelector('.widget')?.getBoundingClientRect();

    protected async doResize(): Promise<void> {
        const gameInfo = await this.ow.getRunningGameInfo();
        if (!gameInfo) {
            return;
        }
        const gameHeight = gameInfo.height;
        this.windowWidth = gameHeight * 0.9;
        this.windowHeight = gameHeight * 0.72;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }
}
