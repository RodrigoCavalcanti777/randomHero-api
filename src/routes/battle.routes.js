import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { battleQuerySchema } from '../schemas/hero.schema.js';
import { battleController } from '../controllers/battle.controller.js';

const router = Router();

router.get('/battle', validate(battleQuerySchema, 'query'), battleController.battle);

export default router;
