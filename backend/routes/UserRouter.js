import express from 'express'
import UserController from '../controllers/UserController.js'

const router = express.Router();

router.post("/cadastro", UserController.cadastrarUsuario);
router.post("/login", UserController.logarUsuario)
router.post("/solicitar-nova-senha", UserController.solicitarNovaSenha)

export default router;