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

  async getRandomHero({ alignment }) {
    const hero = await heroRepository.findRandom({ alignment });
    if (!hero) {
      const { AppError } = await import('../errors/app-error.js');
      throw new AppError({ status: 404, code: 'NOT_FOUND', message: 'Personagem não encontrado.' });
    }
    return hero;
  },

  async getHeroById(id) {
    const hero = await heroRepository.findById(id);
    if (!hero) {
      const { AppError } = await import('../errors/app-error.js');
      throw new AppError({ status: 404, code: 'NOT_FOUND', message: 'Personagem não encontrado.' });
    }
    return hero;
  },

  async updateHero(id, data) {
    const hero = await heroRepository.update(id, data);
    if (!hero) {
      const { AppError } = await import('../errors/app-error.js');
      throw new AppError({ status: 404, code: 'NOT_FOUND', message: 'Personagem não encontrado.' });
    }
    return hero;
  },

  async deleteHero(id) {
    const hero = await heroRepository.findById(id);
    if (!hero) {
      const { AppError } = await import('../errors/app-error.js');
      throw new AppError({ status: 404, code: 'NOT_FOUND', message: 'Personagem não encontrado.' });
    }
    await heroRepository.remove(id);
  },
};