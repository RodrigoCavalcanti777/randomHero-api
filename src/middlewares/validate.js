// src/middlewares/validate.js
import { AppError } from '../errors/app-error.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const parsed = schema.parse(data);
      Object.assign(req[source], parsed);
      if (source === 'query') req.validatedQuery = parsed;
      else if (source === 'body') req.validatedBody = parsed;
      else if (source === 'params') req.validatedParams = parsed;
      next();
    } catch (error) {
      const details = [];
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        for (const err of error.errors) {
          const path = err.path && err.path.length > 0 ? err.path[0] : 'unknown';
          const message = err.message || 'Erro de validação';
          details.push({ field: path, message });
        }
      } else {
        // Se o erro não tiver structure de field errors, adicionar um detalhe genérico
        details.push({ field: 'input', message: error.message || 'Dados inválidos.' });
      }
      
      throw new AppError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos.',
        details,
      });
    }
  };
};