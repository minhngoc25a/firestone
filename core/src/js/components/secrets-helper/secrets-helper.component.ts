import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    Renderer2,
    ViewRef,
} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {BoardSecret} from '../../models/decktracker/board-secret';
import {DebugService} from '../../services/debug.service';
import {AppUiStoreFacadeService} from '../../services/ui-store/app-ui-store-facade.service';
import {cdLog} from '../../services/ui-store/app-ui-store.service';
import {arraysEqual} from '../../services/utils';
import {AbstractSubscriptionComponent} from '../abstract-subscription.component';

@Component({
    selector: 'secrets-helper',
    styleUrls: [
        '../../../css/global/components-global.scss',
        '../../../css/component/secrets-helper/secrets-helper.component.scss',
    ],
    template: `
		<div
			class="root"
			[activeTheme]="'decktracker'"
			[style.opacity]="opacity$ | async"
			*ngIf="{ active: active$ | async } as value"
			[ngClass]="{ 'active': value.active }"
		>
			<div class="main-container">
				<secrets-helper-widget-icon class="icon" [active]="value.active"></secrets-helper-widget-icon>
				<!-- Never remove the scalable from the DOM so that we can perform resizing even when not visible -->
				<div class="scalable">
					<div class="secrets-helper-container">
						<div class="secrets-helper" [style.width.px]="widthInPx">
							<div class="background"></div>
							<secrets-helper-control-bar [windowId]="windowId"></secrets-helper-control-bar>
							<secrets-helper-list
								[secrets]="secrets$ | async"
								[colorManaCost]="colorManaCost$ | async"
								[cardsGoToBottom]="cardsGoToBottom$ | async"
							>
							</secrets-helper-list>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretsHelperComponent extends AbstractSubscriptionComponent implements AfterContentInit, OnDestroy {
    opacity$: Observable<number>;
    colorManaCost$: Observable<boolean>;
    cardsGoToBottom$: Observable<boolean>;
    active$: Observable<boolean>;
    secrets$: Observable<readonly BoardSecret[]>;

    windowId: string;
    widthInPx = 227;

    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
        private readonly init_DebugService: DebugService,
        protected readonly store: AppUiStoreFacadeService,
        protected readonly cdr: ChangeDetectorRef,
    ) {
        super(store, cdr);
    }

    ngAfterContentInit(): void {
        this.active$ = this.store
            .listenDeckState$((state) => state?.opponentDeck?.secretHelperActive)
            .pipe(
                map(([pref]) => pref),
                distinctUntilChanged(),
                tap((filter) =>
                    setTimeout(() => {
                        if (!(this.cdr as ViewRef)?.destroyed) {
                            this.cdr.detectChanges();
                        }
                    }, 0),
                ),
                tap((filter) => cdLog('emitting active in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
        this.secrets$ = this.store
            .listenDeckState$((state) => state?.opponentDeck?.secrets)
            .pipe(
                map(([secrets]) => secrets),
                distinctUntilChanged(arraysEqual),
                tap((filter) =>
                    setTimeout(() => {
                        if (!(this.cdr as ViewRef)?.destroyed) {
                            this.cdr.detectChanges();
                        }
                    }, 0),
                ),
                tap((filter) => cdLog('emitting secrets in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
        this.opacity$ = this.store
            .listenPrefs$((prefs) => prefs.secretsHelperOpacity)
            .pipe(
                map(([pref]) => pref),
                distinctUntilChanged(),
                map((opacity) => opacity / 100),
                tap((filter) =>
                    setTimeout(() => {
                        if (!(this.cdr as ViewRef)?.destroyed) {
                            this.cdr.detectChanges();
                        }
                    }, 0),
                ),
                tap((filter) => cdLog('emitting opacity in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
        this.colorManaCost$ = this.store
            .listen$(([main, nav, prefs]) => prefs.overlayShowRarityColors)
            .pipe(
                map(([pref]) => pref),
                distinctUntilChanged(),
                tap((filter) =>
                    setTimeout(() => {
                        if (!(this.cdr as ViewRef)?.destroyed) {
                            this.cdr.detectChanges();
                        }
                    }, 0),
                ),
                tap((filter) => cdLog('emitting colorManaCost in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );
        this.cardsGoToBottom$ = this.store
            .listen$(([main, nav, prefs]) => prefs.secretsHelperCardsGoToBottom)
            .pipe(
                map(([pref]) => pref),
                distinctUntilChanged(),
                tap((filter) =>
                    setTimeout(() => {
                        if (!(this.cdr as ViewRef)?.destroyed) {
                            this.cdr.detectChanges();
                        }
                    }, 0),
                ),
                tap((filter) => cdLog('emitting cardsGoToBottom in ', this.constructor.name, filter)),
                takeUntil(this.destroyed$),
            );

        this.store
            .listenPrefs$((prefs) => prefs.secretsHelperScale)
            .pipe(
                debounceTime(100),
                map(([pref]) => pref),
                distinctUntilChanged(),
                filter((scale) => !!scale),
                takeUntil(this.destroyed$),
            )
            .subscribe((scale) => {
                this.el.nativeElement.style.setProperty('--secrets-helper-scale', scale / 100);
                this.el.nativeElement.style.setProperty('--secrets-helper-max-height', '22vh');
                const newScale = scale / 100;
                const element = this.el.nativeElement.querySelector('.scalable');
                this.renderer.setStyle(element, 'transform', `scale(${newScale})`);
            });
    }
}
