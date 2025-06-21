import express from 'express'
import autenticarToken from "../middleware/authMiddleware.js";
import UserController from '../controllers/UserController.js'
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/cadastro", UserController.cadastrarUsuario);
router.post("/login", UserController.logarUsuario)
router.post("/solicitar-nova-senha", UserController.solicitarNovaSenha)
router.post("/validar-token", UserController.verificarToken)
router.post("/registrar-nova-senha", UserController.submeterNovaSenha)

router.get('/foto', autenticarToken, UserController.pegarFotoPerfil)
router.get('/perfil', autenticarToken, UserController.pegarDadosUsuario)

router.post('/perfil/:campo', autenticarToken, UserController.atualizarCampo)
router.post('/perfil/foto/nova', autenticarToken, upload.single("foto"), UserController.atualizarFotoPerfil)



export default router;