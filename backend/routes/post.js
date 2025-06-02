import express from "express";
import {
  getPostPerdido,
  todosPosts,
  getPostEncontrado,
  getQuemPublicou,
  getMinhasPublicacoes,
} from "../controllers/PostControler.js";

import AdminController from "../controllers/admController.js";

const router = express.Router();

router.get("/user/:token", getMinhasPublicacoes);
router.get("/all", todosPosts);
router.get("/lost", getPostPerdido);
router.get("/user");
router.get("/found", getPostEncontrado);
router.post("/quem-publicou", getQuemPublicou);

router.post("/denuncia", AdminController.registrarUmaDenuncia);

export default router;
