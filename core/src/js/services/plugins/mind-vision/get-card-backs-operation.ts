import { CardBack } from '../../../models/card-back';
import { OverwolfService } from '../../overwolf.service';
import { SetsService } from '../../sets-service.service';
import { MindVisionOperationFacade } from './mind-vision-operation-facade';
import { MindVisionService } from './mind-vision.service';

export class GetCardBacksOperation extends MindVisionOperationFacade<readonly CardBack[]> {
	constructor(mindVision: MindVisionService, ow: OverwolfService, private allCards: SetsService) {
		super(
			ow,
			'getCardBacks',
			() => mindVision.getCardBacks(),
			(cardBacks: any[]) => cardBacks.length === 0,
			cardBacks =>
				cardBacks.map(
					cardBack =>
						({
							id: cardBack.CardBackId,
						} as CardBack),
				),
			20,
			5000,
		);
	}
}