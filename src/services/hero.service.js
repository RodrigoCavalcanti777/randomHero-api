// src/services/hero.service.js
import { heroRepository } from '../repositories/hero.repository.js';

export const heroService = {
  async createHero(data) {
    const hero = await heroRepository.create(data);
    return hero;
  },

  async listHeroes({ alignment, page, limit }) {
    const result = await heroRepository.list({ alignment, page, limit });
    const totalPages = Math.ceil(result.total / limit);
    return {
      data: result.items,
      page,
      limit,
      total: result.total,
      totalPages,
    };
  },
};