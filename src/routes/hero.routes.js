// src/routes/hero.routes.js
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createHeroSchema, listQuerySchema, idParamSchema } from '../schemas/hero.schema.js';
import { heroController } from '../controllers/hero.controller.js';

const router = Router();

router.get('/hero', validate(listQuerySchema, 'query'), heroController.list);
router.post('/hero', validate(createHeroSchema), heroController.create);
router.get('/hero/:id', validate(idParamSchema, 'params'), heroController.getById);

export default router;