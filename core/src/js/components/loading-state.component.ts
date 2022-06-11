import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
    OnDestroy,
    ViewEncapsulation,
} from '@angular/core';
import {LocalizationFacadeService} from '@services/localization-facade.service';

@Component({
    selector: 'loading-state',
    styleUrls: [`../../css/component/loading-state.component.scss`],
    template: `
		<div class="loading-state {{ className }}">
			<div class="state-container">
				<div class="loading-icon" [inlineSVG]="loadingStateSvgName"></div>
				<span class="title" *ngIf="mainTitle"> {{ mainTitle }} </span>
				<span class="subtitle" *ngIf="subtitle">{{ subtitle }}</span>
			</div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class LoadingStateComponent implements OnDestroy {
    @Input() mainTitle = this.i18n.translateString('app.loading.title');
    @Input() subtitle = this.i18n.translateString('app.loading.subtitle');
    @Input() hint: boolean;
    loadingStateSvgName = 'assets/svg/loading_state.svg';
    className: string;
    private interval;

    constructor(private readonly cdr: ChangeDetectorRef, private readonly i18n: LocalizationFacadeService) {
    }

    @Input() set svgName(value: string) {
        if (value) {
            this.loadingStateSvgName = `assets/svg/${value}.svg`;
            this.className = value.replace('/', '-');
        }
    }

    @HostListener('window:beforeunload')
    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
