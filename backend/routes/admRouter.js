import express from 'express';
import getUsuariosController from '../controllers/getUserEDenuncias.js';
import AdminController from '../controllers/admController.js'

const router = express.Router();

router.get('/usuarios', getUsuariosController);

router.post('/denuncia', AdminController.registrarUmaDenuncia); 

export default router