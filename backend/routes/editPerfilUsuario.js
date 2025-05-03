const express = require("express");
const router = express.Router();
import editPerfilUsuario from "../model/editPerfilUsuario";
import usuarioController from "../controllers/editPerfilUsuarioController";

const multer = require("multer");
const upload = multer();

router.get("/usuarios/email/:email", usuarioController.buscarUsuarioPorEmail);
router.post("/usuarios/email/:email/:campo", usuarioController.editarCampoPorEmail);
router.post("/usuarios/email/:email/foto", upload.single("foto"), usuarioController.editarFotoPorEmail);

export default router;

