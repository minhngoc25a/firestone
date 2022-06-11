import {CardIds} from '@firestone-hs/reference-data';
import {CardsFacadeService} from '@services/cards-facade.service';
import {BattlegroundsState} from '../../../../models/battlegrounds/battlegrounds-state';
import {BgsGame} from '../../../../models/battlegrounds/bgs-game';
import {BgsPlayer} from '../../../../models/battlegrounds/bgs-player';
import {getHeroPower, normalizeHeroCardId} from '../../bgs-utils';
import {BgsOpponentRevealedEvent} from '../events/bgs-opponent-revealed-event';
import {BattlegroundsStoreEvent} from '../events/_battlegrounds-store-event';
import {EventParser} from './_event-parser';

export class BgsOpponentRevealedParser implements EventParser {
    constructor(private readonly allCards: CardsFacadeService) {
    }

    public applies(gameEvent: BattlegroundsStoreEvent, state: BattlegroundsState): boolean {
        return state && state.currentGame && gameEvent.type === 'BgsOpponentRevealedEvent';
    }

    public async parse(currentState: BattlegroundsState, event: BgsOpponentRevealedEvent): Promise<BattlegroundsState> {
        console.log(
            'opponent revealed',
            event.cardId,
            currentState?.currentGame?.players?.map((player) => player.cardId),
        );
        const normalizedCardId = normalizeHeroCardId(event.cardId, this.allCards);
        if (normalizedCardId === CardIds.KelthuzadBattlegrounds) {
            return currentState;
        }

        const existingPlayer = currentState.currentGame.players.find(
            (player) => normalizeHeroCardId(player.cardId, this.allCards) === normalizedCardId,
        );
        const newPlayer =
            existingPlayer != null
                ? existingPlayer.update({
                    leaderboardPlace: event.leaderboardPlace === -1 ? null : event.leaderboardPlace,
                } as BgsPlayer)
                : BgsPlayer.create({
                    cardId: normalizedCardId,
                    heroPowerCardId: getHeroPower(event.cardId, this.allCards),
                    name: this.allCards.getCard(event.cardId).name,
                    leaderboardPlace: event.leaderboardPlace === -1 ? null : event.leaderboardPlace,
                } as BgsPlayer);
        const newGame = currentState.currentGame.update({
            players: [
                ...currentState.currentGame.players.filter(
                    (player) => normalizeHeroCardId(player.cardId, this.allCards) !== normalizedCardId,
                ),
                newPlayer,
            ] as readonly BgsPlayer[],
        } as BgsGame);
        return currentState.update({
            currentGame: newGame,
        } as BattlegroundsState);
    }
}
