// src/app.js
import express from 'express';
import healthRoutes from './routes/health.routes.js';
import { AppError } from './errors/app-error.js';
import errorHandler from './middlewares/error-handler.js';

const app = express();
app.use(express.json());
app.use(healthRoutes);

// Handler para rotas inexistentes (NOT_FOUND)
app.use((req, res, next) => {
  next(new AppError({ status: 404, code: 'NOT_FOUND', message: 'Recurso não encontrado.' }));
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

export default app;