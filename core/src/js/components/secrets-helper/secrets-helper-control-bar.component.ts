import {ChangeDetectionStrategy, Component, EventEmitter, Input} from '@angular/core';
import {GameEvent} from '../../models/game-event';
import {OverwolfService} from '../../services/overwolf.service';

@Component({
    selector: 'secrets-helper-control-bar',
    styleUrls: [
        '../../../css/global/components-global.scss',
        '../../../css/component/secrets-helper/secrets-helper-control-bar.component.scss',
    ],
    template: `
		<div class="control-bar">
			<div class="title" [owTranslate]="'decktracker.secrets-helper.title'"></div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretsHelperControlBarComponent {
    @Input() windowId: string;
    minimizeHandler: () => void;

    private deckUpdater: EventEmitter<GameEvent>;

    constructor(private readonly ow: OverwolfService) {
        this.deckUpdater = this.ow.getMainWindow().deckUpdater;
        this.minimizeHandler = () =>
            this.deckUpdater.next(
                Object.assign(new GameEvent(), {
                    type: 'TOGGLE_SECRET_HELPER',
                } as GameEvent),
            );
    }
}
