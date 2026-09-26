// src/middlewares/error-handler.js
import { AppError } from '../errors/app-error.js';

export default (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'JSON malformado.',
      },
    });
  }

  if (err instanceof AppError) {
    const errorResponse = {
      error: {
        code: err.code,
        message: err.message,
      },
    };

    if (err.code === 'VALIDATION_ERROR' && err.details && err.details.length > 0) {
      errorResponse.error.details = err.details;
    }

    return res.status(err.status).json(errorResponse);
  }

  console.error('Erro não tratado:', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
    },
  });
};