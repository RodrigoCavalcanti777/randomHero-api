// src/schemas/hero.schema.js
import { z } from 'zod';

export const createHeroSchema = z.object({
  name: z.string().trim().min(2, { message: 'Nome deve ter ao menos 2 caracteres' }).max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  age: z.number().int().min(1, { message: 'Idade deve ser maior que 0' }).max(10000, { message: 'Idade não pode ser maior que 10000' }),
  gender: z.string().trim().min(1, { message: 'Gênero deve ter ao menos 1 caractere' }).max(30, { message: 'Gênero não pode ter mais de 30 caracteres' }),
  ability: z.string().trim().min(1, { message: 'Habilidade deve ter ao menos 1 caractere' }).max(200, { message: 'Habilidade não pode ter mais de 200 caracteres' }),
  alignment: z.enum(['hero', 'villain']),
  power: z.number().int().min(1, { message: 'Power deve ser maior que 0' }).max(100, { message: 'Power não pode ser maior que 100' }),
  background: z.string().trim().max(500, { message: 'Background não pode ter mais de 500 caracteres' }).nullable(),
});

export const generateHeroSchema = z.object({
  // Campos opcionais para geração - o cliente pode enviar apenas um subconjunto
  name: z.string().trim().min(2, { message: 'Nome deve ter ao menos 2 caracteres' }).max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  age: z.number().int().min(16, { message: 'Idade deve ser maior que 15' }).max(900, { message: 'Idade não pode ser maior que 900' }),
  gender: z.enum(['male', 'female', 'other']),
  ability: z.string().trim().min(1, { message: 'Habilidade deve ter ao menos 1 caractere' }).max(200, { message: 'Habilidade não pode ter mais de 200 caracteres' }),
  background: z.string().trim().max(500, { message: 'Background não pode ter mais de 500 caracteres' }).nullable(),
  alignment: z.enum(['hero', 'villain']),
  power: z.number().int().min(1, { message: 'Power deve ser maior que 0' }).max(100, { message: 'Power não pode ser maior que 100' }),
});

export const idParamSchema = z.number().int().positive({ message: 'ID deve ser um inteiro positivo' });

export const listQuerySchema = z.object({
  alignment: z.enum(['hero', 'villain']).optional(),
  page: z.number({ message: 'Page deve ser um inteiro' }).int().min(1, { message: 'Page deve ser maior que 0' }).default(1),
  limit: z.number({ message: 'Limit deve ser um inteiro' }).int().min(1, { message: 'Limit deve ser maior que 0' }).max(50, { message: 'Limit deve ser no máximo 50' }).default(10),
});

export const randomQuerySchema = z.object({
  alignment: z.enum(['hero', 'villain']).optional(),
});

export const battleQuerySchema = z.object({
  hero1: z.number({ message: 'Hero1 deve ser um inteiro' }).int().positive({ message: 'Hero1 deve ser positivo' }),
  hero2: z.number({ message: 'Hero2 deve ser um inteiro' }).int().positive({ message: 'Hero2 deve ser positivo' }),
}).refine((data) => data.hero1 !== data.hero2, { message: 'hero1 e hero2 devem ser IDs diferentes' });