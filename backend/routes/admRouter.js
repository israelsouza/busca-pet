import express from 'express';
import AdminController from '../controllers/admController.js'

const router = express.Router();

router.get('/usuarios', AdminController.getUsuariosEDenuncias);

router.post('/denuncia', AdminController.registrarUmaDenuncia); 

export default router