// src/routes/hero.routes.js
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createHeroSchema, listQuerySchema, idParamSchema, randomQuerySchema } from '../schemas/hero.schema.js';
import { heroController } from '../controllers/hero.controller.js';

const router = Router();

router.get('/hero', validate(listQuerySchema, 'query'), heroController.list);
router.post('/hero', validate(createHeroSchema), heroController.create);
router.get('/hero/random', validate(randomQuerySchema, 'query'), heroController.getRandom);
router.get('/hero/:id', validate(idParamSchema, 'params'), heroController.getById);
router.put('/hero/:id', validate(idParamSchema, 'params'), validate(createHeroSchema), heroController.update);
router.delete('/hero/:id', validate(idParamSchema, 'params'), heroController.delete);

export default router;