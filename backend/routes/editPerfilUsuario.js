const express = require("express");
const router = express.Router();
import editPerfilUsuario from "../model/editPerfilUsuario";
import usuarioController from "../controllers/editPerfilUsuarioController";

const multer = require("multer");
const upload = multer();

router.get("/usuarios/email/:email", usuarioController.buscarUsuario);
router.post("/usuarios/email/:email/:campo", usuarioController.atualizarCampo);
router.post("/usuarios/email/:email/foto", upload.single("foto"), usuarioController.atualizarFoto);

export default router;

