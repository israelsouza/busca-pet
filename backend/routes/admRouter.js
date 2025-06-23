import express from "express";
import AdmController, {
  deletarUmaPublicacao,
  atualizarUnicoUsuario,
  banirUsuario} from "../controllers/admController.js";

const router = express.Router();

router.get("/usuarios-e-denuncias", AdmController.pegarUsuariosEDenuncias);
router.get("/denuncias", AdmController.pegarDenuncias);
router.get("/denuncias/post/:id", AdmController.pegarPostDenunciado);

router.put("/denuncias/:idDenuncia/:idPost/:status", AdmController.atualizarStatusDenuncia);


router.put("/usuario/:email", banirUsuario);

router.patch("/usuario/:id", atualizarUnicoUsuario);

router.delete("/post/:idPost", deletarUmaPublicacao);

export default router;
