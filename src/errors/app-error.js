// src/errors/app-error.js
export class AppError {
  constructor({ status = 400, code = 'VALIDATION_ERROR', message = 'Erro', details = [] }) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.details = details;
  }
}