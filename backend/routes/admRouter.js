import express from "express";
import AdminController from "../controllers/admController.js";

const router = express.Router();

router.get("/usuarios", AdminController.getUsuariosEDenuncias);
router.get("/denuncias", AdminController.getDenuncias);
router.get("/denuncias/post/:id", AdminController.getPublicacaoDenunciada);

router.put("/denuncias/:idDenuncia/:idPost/:status", AdminController.atualizarStatus);

export default router;
