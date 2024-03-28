import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registrarse', signup);
router.post('/iniciar-sesion', signin);
router.post('/google', google);

export default router;