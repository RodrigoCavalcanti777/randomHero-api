import { heroRepository } from '../repositories/hero.repository.js';
import { AppError } from '../errors/app-error.js';

export const battleService = {
  async simulateBattle(hero1Id, hero2Id) {
    const hero1 = await heroRepository.findById(hero1Id);
    const hero2 = await heroRepository.findById(hero2Id);

    if (!hero1 || !hero2) {
      throw new AppError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Personagem não encontrado.',
      });
    }

    const tiebreak = hero1.power === hero2.power;
    let winner = hero1;
    let loser = hero2;

    if (tiebreak) {
      winner = Math.random() < 0.5 ? hero1 : hero2;
      loser = winner === hero1 ? hero2 : hero1;
    } else {
      if (hero2.power > hero1.power) {
        winner = hero2;
        loser = hero1;
      }
    }

    return {
      winner: { id: winner.id, name: winner.name, power: winner.power },
      loser: { id: loser.id, name: loser.name, power: loser.power },
      tiebreak,
    };
  },
};
