const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/usuarios/:id", usuarioController.buscarUsuario);
router.post("/usuarios/1/:campo", usuarioController.editarCampo);

const multer = require("multer");
const upload = multer();

router.post("/usuarios/1/foto", upload.single("foto"), usuarioController.editarFoto);

module.exports = router;
