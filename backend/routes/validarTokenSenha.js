import express from 'express'
import validarTokenSenhaController from '../controllers/validarTokenSenhaController.js';

const router = express.Router();

router.post("/", validarTokenSenhaController )

export default router;