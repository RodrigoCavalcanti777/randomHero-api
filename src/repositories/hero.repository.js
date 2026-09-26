// src/repositories/hero.repository.js
import { supabase } from '../config/supabase.js';
import { AppError } from '../errors/app-error.js';

export const heroRepository = {
  async create(data) {
    const { data: result, error } = await supabase
      .from('heroes')
      .insert(data)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError({
          status: 409,
          code: 'DUPLICATE_NAME',
          message: 'Nome já está em uso.',
        });
      }
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao criar personagem.',
      });
    }

    return result;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao buscar personagem.',
      });
    }

    return data;
  },

  async list({ alignment, page, limit }) {
    const offset = (page - 1) * limit;
    let query = supabase
      .from('heroes')
      .select('*', { count: 'exact', head: false })
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (alignment) {
      query = query.eq('alignment', alignment);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao listar personagens.',
      });
    }

    return {
      items: data,
      total: count,
    };
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('heroes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError({
          status: 409,
          code: 'DUPLICATE_NAME',
          message: 'Nome já está em uso.',
        });
      }
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao atualizar personagem.',
      });
    }

    return result;
  },

  async remove(id) {
    const { error } = await supabase
      .from('heroes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao excluir personagem.',
      });
    }

    return true;
  },

  async findRandom({ alignment }) {
    let query = supabase.from('heroes').select('*').order('random()').limit(1);

    if (alignment) {
      query = query.eq('alignment', alignment);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro ao sortear personagem.',
      });
    }

    return data[0] || null;
  },
};