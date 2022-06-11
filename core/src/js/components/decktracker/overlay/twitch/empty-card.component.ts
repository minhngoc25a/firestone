import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewRef} from '@angular/core';

@Component({
    selector: 'empty-card',
    styleUrls: [
        '../../../../../css/global/components-global.scss',
        '../../../../../css/component/decktracker/overlay/twitch/empty-card.component.scss',
    ],
    template: `
		<div
			class="card"
			[cardTooltip]="_cardId"
			[cardTooltipBgs]="_cardTooltipBgs"
			[style.transform]="_transform"
			[style.left.%]="_leftOFfset"
			[style.top.%]="_topOffset"
		></div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCardComponent {
    _leftOFfset: number;

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    @Input() set leftOffset(value: number) {
        this._leftOFfset = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _cardId: string;

    @Input() set cardId(value: string) {
        this._cardId = value;
        // const imageUrl = `https://static.firestoneapp.com/cards/enUS/512/${value}.png?v=3`;
        // // Preload
        // const image = new Image();
        // image.onload = () => console.debug('[image-preloader] preloaded image', imageUrl);
        // image.src = imageUrl;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _topOffset: number;

    @Input() set topOffset(value: number) {
        this._topOffset = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _transform: string;

    @Input() set transform(value: string) {
        this._transform = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    _cardTooltipBgs: boolean;

    @Input() set cardTooltipBgs(value: boolean) {
        this._cardTooltipBgs = value;
        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }
}
