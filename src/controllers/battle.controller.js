import { battleService } from '../services/battle.service.js';

export const battleController = {
  async battle(req, res, next) {
    try {
      const result = await battleService.simulateBattle(req.validatedQuery.hero1, req.validatedQuery.hero2);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
