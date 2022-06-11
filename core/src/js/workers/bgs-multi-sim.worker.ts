import {AllCardsService} from '@firestone-hs/reference-data';
import {simulateBattle} from '@firestone-hs/simulate-bgs-battle';
import {BgsBattleInfo} from '@firestone-hs/simulate-bgs-battle/dist/bgs-battle-info';
import {CardsData} from '@firestone-hs/simulate-bgs-battle/dist/cards/cards-data';
import {SimulationResult} from '@firestone-hs/simulate-bgs-battle/dist/simulation-result';
import {InternalPermutationResult} from '../services/battlegrounds/bgs-battle-positioning.service';

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.onmessage = async (ev) => {
    const battleMessages: readonly BgsBattleInfo[] = ev.data.battleMessages;
    const cards: AllCardsService = Object.assign(new AllCardsService(), ev.data.cards);

    const cardsData = new CardsData(cards, false);
    cardsData.inititialize(battleMessages[0].options.validTribes);

    const permutationResults: InternalPermutationResult[] = [];
    // let i = 0;

    for (const battleInfo of battleMessages) {
        // console.debug('permutation', i++, battleMessages.length, battleInfo);
        const permutationResult: SimulationResult = simulateBattle(battleInfo, cards, cardsData);
        // console.debug('\t permutationResult', permutationResult);
        if (!!permutationResult) {
            permutationResults.push({
                permutation: battleInfo.playerBoard.board,
                result: {
                    ...permutationResult,
                    outcomeSamples: undefined,
                },
            });
        }
        // console.debug('\t updated results');
    }

    ctx.postMessage(JSON.stringify(permutationResults));
};
