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

  async getRandom(req, res, next) {
    try {
      const hero = await heroService.getRandomHero(req.validatedQuery ?? req.query);
      res.status(200).json(hero);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const hero = await heroService.getHeroById(req.validatedParams.id);
      res.status(200).json(hero);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const hero = await heroService.updateHero(req.validatedParams.id, req.validatedBody);
      res.status(200).json(hero);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await heroService.deleteHero(req.validatedParams.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};