const express = require("express");
const router = express.Router();
import editPerfilUsuario from "../model/editPerfilUsuario";

const multer = require("multer");
const upload = multer();

router.get("/usuarios/:id", usuarioController.buscarUsuario);
router.post("/usuarios/:id/:campo", usuarioController.editarCampo);
router.post("/usuarios/:id/foto", upload.single("foto"), usuarioController.editarFoto);

export default router;
