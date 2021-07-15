import { BoardEntity } from '@firestone-hs/simulate-bgs-battle/dist/board-entity';
import { BgsFaceOffWithSimulation } from '../../../battlegrounds/bgs-face-off-with-simulation';

export class BgsCustomSimulationState {
	public readonly faceOff: BgsFaceOffWithSimulation;
	public readonly picker: BgsCustomSimulationPicker;

	constructor() {
		this.faceOff = this.buildInitialFaceOff();
	}

	public update(base: BgsCustomSimulationState): BgsCustomSimulationState {
		return Object.assign(new BgsCustomSimulationState(), this, base);
	}

	public findEntity(side: string, minionIndex: number): BoardEntity {
		const existingSide =
			side === 'player' ? this.faceOff.battleInfo.playerBoard : this.faceOff.battleInfo.opponentBoard;
		return existingSide.board[minionIndex];
	}

	private buildInitialFaceOff(): BgsFaceOffWithSimulation {
		return BgsFaceOffWithSimulation.create({
			battleInfo: {
				playerBoard: {
					board: [],
					player: {
						cardId: 'TB_BaconShop_HERO_KelThuzad',
						hpLeft: 40,
						tavernTier: 6,
						heroPowerId: null,
						heroPowerUsed: true,
					},
				},
				opponentBoard: {
					board: [],
					player: {
						cardId: 'TB_BaconShop_HERO_KelThuzad',
						hpLeft: 40,
						tavernTier: 6,
						heroPowerId: null,
						heroPowerUsed: true,
					},
				},
				options: {
					numberOfSimulations: 8000,
					maxAcceptableDuration: 6000,
					// No restrictions on tribes yet
					validTribes: undefined,
				},
			},
		} as BgsFaceOffWithSimulation);
	}
}

export interface BgsCustomSimulationPicker {
	readonly type: 'minion' | 'hero' | 'minion-update';
	readonly side: 'player' | 'opponent';
	readonly minionIndex?: number;
}