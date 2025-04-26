import express from 'express'
import {EsqueciSenhaController} from '../controllers/EsqueciSenhaController.js'

const router = express.Router();

router.post( "/", EsqueciSenhaController )

export default router;