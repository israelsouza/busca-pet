import express from 'express'
import atualizarSenhaController from '../controllers/atualizarSenhaController.js'

const router = express.Router();

router.post("/", atualizarSenhaController)

export default router;