import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Race} from '@firestone-hs/reference-data';
import {CardsFacadeService} from '@services/cards-facade.service';

@Component({
    selector: 'bgs-tavern-minion',
    styleUrls: [
        '../../../../css/global/components-global.scss',
        '../../../../css/themes/battlegrounds-theme.scss',
        '../../../../css/component/battlegrounds/overlay/bgs-tavern-minion.component.scss',
    ],
    template: `
		<div class="battlegrounds-theme card">
			<!-- transparent image with 1:1 intrinsic aspect ratio -->
			<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />

			<div
				class="highlight highlight-minion"
				*ngIf="highlightedFromMinion"
				inlineSVG="assets/svg/pinned.svg"
				[style.top.%]="minionTop"
				[style.right.%]="minionRight"
			></div>
			<div
				class="highlight highlight-tribe"
				*ngIf="highlightedFromTribe"
				inlineSVG="assets/svg/created_by.svg"
				[style.top.%]="tribeTop"
				[style.right.%]="tribeRight"
			></div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgsTavernMinionComponent {
    @Input() showTribesHighlight: boolean;
    _minionCardId: string;
    highlightedFromTribe: boolean;
    highlightedFromMinion: boolean;
    tribeTop: number;
    tribeRight: number;
    minionTop: number;
    minionRight: number;

    constructor(private readonly allCards: CardsFacadeService) {
    }

    @Input() set minion(value: string) {
        this._minionCardId = value;
        this.updateValues();
    }

    _highlightedTribes: readonly Race[] = [];

    @Input() set highlightedTribes(value: readonly Race[]) {
        this._highlightedTribes = value ?? [];
        this.updateValues();
    }

    _highlightedMinions: readonly string[] = [];

    @Input() set highlightedMinions(value: readonly string[]) {
        this._highlightedMinions = value ?? [];
        this.updateValues();
    }

    private updateValues() {
        this.highlightedFromTribe = false;
        this.highlightedFromMinion = false;
        if (
            !this.showTribesHighlight ||
            !this._minionCardId ||
            (!this._highlightedTribes?.length && !this._highlightedMinions?.length)
        ) {
            return;
        }

        const card = this.allCards.getCard(this._minionCardId);
        const tribe: Race = card.race ? Race[card.race.toUpperCase()] : Race.BLANK;
        this.highlightedFromTribe =
            this._highlightedTribes.includes(tribe) || (this._highlightedTribes.length > 0 && tribe === Race.ALL);
        this.highlightedFromMinion = this._highlightedMinions.includes(card.id);

        if (this.highlightedFromTribe) {
            this.tribeTop = 10;
            this.tribeRight = 8;
            if (this.highlightedFromMinion) {
                this.minionTop = 29;
                this.minionRight = 1;
            }
        } else {
            this.minionTop = 10;
            this.minionRight = 8;
        }
    }
}
