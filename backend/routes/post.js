import express from "express";
import {
  getPostPerdido,
  todosPosts,
  getPostEncontrado,
  getQuemPublicou,
  getMinhasPublicacoes,
} from "../controllers/PostControler.js";
import upload from "../middleware/multerConfig.js";

import AdminController from "../controllers/admController.js";

import PostController from "../controllers/PostController.js";

const router = express.Router();

router.get("/user/:token", getMinhasPublicacoes);
router.get("/all", todosPosts);
router.get("/lost", getPostPerdido);
router.get("/user");
router.get("/found", getPostEncontrado);
router.post("/quem-publicou", getQuemPublicou);

router.post("/denuncia", AdminController.registrarUmaDenuncia);

router.post(
  "/registrar-pet",
  upload.single("imagem"),
  PostController.cadastrarUmPet
);

export default router;
