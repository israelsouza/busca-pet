import express from 'express'
import { getPostsPorTexto, getPetsPorArea } from '../controllers/PostControler.js'

const router = express.Router();

router.get("/busca", getPostsPorTexto)
router.get("/area", getPetsPorArea);

export default router;