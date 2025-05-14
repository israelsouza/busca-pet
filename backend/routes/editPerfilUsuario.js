import express from "express";
import usuarioController from "../controllers/editPerfilUsuarioController.js";
import multer from "multer";  // Importação correta para ES Modules

const router = express.Router();
const upload = multer();

router.get("/email/:email", usuarioController.pegarTodosOsDados);
router.post("/email/:email/:campo", usuarioController.atualizarCampo);
router.post("/foto/:email", upload.single("foto"), usuarioController.atualizarFoto);

export default router;
