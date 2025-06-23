import express from "express";
import AdmController from "../controllers/admController.js";

const router = express.Router();

router.get("/usuarios-e-denuncias", AdmController.pegarUsuariosEDenuncias);
router.get("/denuncias", AdmController.pegarDenuncias);
router.get("/denuncias/post/:id", AdmController.pegarPostDenunciado);

router.put("/denuncias/:idDenuncia/:idPost/:status", AdmController.atualizarStatusDenuncia);
router.put("/usuario/banir", AdmController.banirUsuario);

router.patch("/usuario/:id", AdmController.atualizarDadoUsuario);

router.delete("/post/:id", AdmController.deletarPublicacao);

export default router;
