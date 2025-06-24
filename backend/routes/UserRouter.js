import express from 'express'
import autenticarToken from "../middleware/authMiddleware.js";
import UserController from '../controllers/UserController.js'
import multer from "multer";
import authorizeAdminRole from '../middleware/authRole.js'

const upload = multer();
const router = express.Router();

router.post("/cadastro", UserController.cadastrarUsuario);
router.post("/login", UserController.logarUsuario)
router.post("/solicitar-nova-senha", UserController.solicitarNovaSenha)
router.post("/validar-token", UserController.verificarToken)
router.post("/registrar-nova-senha", UserController.submeterNovaSenha)

router.get('/foto', autenticarToken, UserController.pegarFotoPerfil)
router.get('/foto-com-nome', autenticarToken, UserController.pegarFotoPerfilComNome)
router.get('/perfil', autenticarToken, UserController.pegarDadosUsuario)
router.get("/usuarios-e-denuncias",autenticarToken, authorizeAdminRole, UserController.pegarUsuariosEDenuncias);

router.post('/perfil/:campo', autenticarToken, UserController.atualizarCampo)
router.post('/perfil/foto/nova', autenticarToken, upload.single("foto"), UserController.atualizarFotoPerfil)

router.patch("/usuario/:id", autenticarToken, authorizeAdminRole, UserController.atualizarDadoUsuario);
router.put("/usuario/banir", autenticarToken, authorizeAdminRole, UserController.banirUsuario);

export default router;