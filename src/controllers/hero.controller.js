// src/controllers/hero.controller.js
import { heroService } from '../services/hero.service.js';

export const heroController = {
  async create(req, res, next) {
    try {
      const hero = await heroService.createHero(req.body);
      res.status(201).json(hero);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const result = await heroService.listHeroes(req.validatedQuery ?? req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};