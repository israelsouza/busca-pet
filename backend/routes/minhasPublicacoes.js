import express from 'express'
import getMinhasPublicacoes from "../controllers/minhasPublicacoes.js";

const router = express.Router();

router.get("/", getMinhasPublicacoes)

export default router;