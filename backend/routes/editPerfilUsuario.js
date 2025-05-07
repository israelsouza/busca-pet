import express from "express";
const router = express.Router();
import usuarioController from "../controllers/editPerfilUsuarioController.js";
import multer from "multer";  // Importação correta para ES Modules

const upload = multer();


router.post("/usuarios/email/:email/:campo", usuarioController.atualizarCampo);
router.post("/usuarios/email/:email/foto", upload.single("foto"), usuarioController.atualizarFoto);

export default router;
