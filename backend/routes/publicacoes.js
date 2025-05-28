import express from 'express'
import { getPostsPorTexto } from '../controllers/PostControler.js'

const router = express.Router();

router.get("/busca", getPostsPorTexto)

export default router;