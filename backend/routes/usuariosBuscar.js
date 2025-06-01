import express from 'express';
import getUsuariosController from '../controllers/getUserEDenuncias.js';

const router = express.Router();

router.get('/usuarios', getUsuariosController);

export default router;