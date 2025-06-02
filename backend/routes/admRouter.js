import express from 'express';
import getUsuariosController from '../controllers/getUserEDenuncias.js';
import {denunciaControl} from '../controllers/admController.js'

const router = express.Router();

router.get('/usuarios', getUsuariosController);

router.post('/denuncia', denunciaControl); 

export default router;