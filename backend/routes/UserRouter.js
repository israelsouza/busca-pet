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

router.post('/perfil/:campo', autenticarToken, UserController.atualizarCampo)
router.post('/perfil/foto/nova', autenticarToken, upload.single("foto"), UserController.atualizarFotoPerfil)

// user
// router.get("/usuarios-e-denuncias", authorizeAdminRole, AdmController.pegarUsuariosEDenuncias);
// router.patch("/usuario/:id", authorizeAdminRole, AdmController.atualizarDadoUsuario);
// router.put("/usuario/banir", authorizeAdminRole, AdmController.banirUsuario);

export default router;