import express from "express";
import {
  getQuemPublicou
} from "../controllers/PostController.js";
import PostController from "../controllers/PostController.js";
import upload from "../middleware/multerConfig.js";

import AdminController from "../controllers/admController.js";


const router = express.Router();

router.get("/meus", PostController.pegarMinhasPublicacoes);
router.get("/:categoria", PostController.pegarPostsPorCategoria);

router.post("/quem-publicou", getQuemPublicou);
router.post("/denuncia", AdminController.registrarUmaDenuncia);
router.post("/registrar-pet", upload.single("imagem"), PostController.cadastrarUmPet);

export default router;
