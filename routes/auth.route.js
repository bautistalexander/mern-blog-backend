import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registrarse', signup);
router.post('/iniciar-sesion', signin);

export default router;