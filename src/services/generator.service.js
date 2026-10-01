import { generateLists } from '../data/generator-data.js';
import { heroRepository } from '../repositories/hero.repository.js';
import { AppError } from '../errors/app-error.js';

export const generatorService = {
  async generateHero(data = {}) {
    const lists = generateLists();
    const fixedName = data.name !== undefined;

    const buildHero = () => ({
      name: data.name !== undefined
        ? data.name
        : `${lists.prefixes[Math.floor(Math.random() * lists.prefixes.length)]} ${lists.suffixes[Math.floor(Math.random() * lists.suffixes.length)]}`,
      age: data.age !== undefined ? data.age : Math.floor(Math.random() * (900 - 16 + 1)) + 16,
      gender: data.gender !== undefined ? data.gender : (['male', 'female', 'other'][Math.floor(Math.random() * 3)]),
      ability: data.ability !== undefined ? data.ability : lists.abilities[Math.floor(Math.random() * lists.abilities.length)],
      alignment: data.alignment !== undefined ? data.alignment : (['hero', 'villain'][Math.floor(Math.random() * 2)]),
      power: data.power !== undefined ? data.power : Math.floor(Math.random() * 100) + 1,
      background: data.background !== undefined ? data.background : lists.backgrounds[Math.floor(Math.random() * lists.backgrounds.length)],
    });

    if (fixedName) {
      try {
        return await heroRepository.create(buildHero());
      } catch (error) {
        if (error.code === 'DUPLICATE_NAME') {
          throw new AppError({ status: 409, code: 'DUPLICATE_NAME', message: 'Nome já está em uso.' });
        }
        throw error;
      }
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await heroRepository.create(buildHero());
      } catch (error) {
        if (error.code === 'DUPLICATE_NAME') {
          if (attempt === 4) {
            throw new AppError({ status: 409, code: 'DUPLICATE_NAME', message: 'Nome já está em uso.' });
          }
          continue;
        }
        throw error;
      }
    }

    throw new AppError({ status: 409, code: 'DUPLICATE_NAME', message: 'Nome já está em uso.' });
  },
};
