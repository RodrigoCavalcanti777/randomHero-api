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
};