// src/services/hero.service.js
import { heroRepository } from '../repositories/hero.repository.js';

export const heroService = {
  async createHero(data) {
    const hero = await heroRepository.create(data);
    return hero;
  },
};