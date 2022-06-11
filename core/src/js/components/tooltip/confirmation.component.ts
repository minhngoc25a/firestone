import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewRef,
} from '@angular/core';
import {LocalizationFacadeService} from '@services/localization-facade.service';

@Component({
    selector: 'confirmation',
    styleUrls: [`../../../css/component/tooltip/confirmation.component.scss`],
    template: `
		<div class="confirmation">
			<div class="title">{{ _confirmationTitle }}</div>
			<div class="text">
				{{ _confirmationText }}
			</div>
			<div class="buttons">
				<button class="ok" (click)="ok()" *ngIf="_showOk">{{ _validButtonText }}</button>
				<button class="cancel" (click)="cancel()">{{ _cancelButtonText }}</button>
			</div>
			<button class="close-button" (click)="cancel()">
				<svg class="svg-icon-fill">
					<use
						xmlns:xlink="https://www.w3.org/1999/xlink"
						xlink:href="assets/svg/sprite.svg#window-control_close"
					></use>
				</svg>
			</button>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
    @Output() onConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly i18n: LocalizationFacadeService) {
    }

    _confirmationTitle = this.i18n.translateString('app.global.controls.default-confirmation-title');

    @Input() set confirmationTitle(value: string) {
        this._confirmationTitle = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _confirmationText = this.i18n.translateString('app.global.controls.default-confirmation-text');

    @Input() set confirmationText(value: string) {
        this._confirmationText = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _validButtonText = this.i18n.translateString('app.global.controls.default-validation-button');

    @Input() set validButtonText(value: string) {
        this._validButtonText = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _cancelButtonText = this.i18n.translateString('app.global.controls.default-cancel-button');

    @Input() set cancelButtonText(value: string) {
        this._cancelButtonText = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _showOk = true;

    @Input() set showOk(value: boolean) {
        this._showOk = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    ok() {
        this.onConfirm.next(true);
    }

    cancel() {
        this.onCancel.next(true);
    }
}
