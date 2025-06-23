import express from "express";
import NotificationController from '../controllers/NotificationController.js'
import authorizeAdminRole from '../middleware/authRole.js'

const router = express.Router();

router.post('/criar/mensagem', NotificationController.criarEnviarMensagem)
router.get("/mensagem", NotificationController.pegarNotificacoes);
router.delete('/mensagem/:id', NotificationController.excluirUmaNotificacao)
router.post('/criar/denuncia', NotificationController.criarUmaDenuncia)

router.get("/denuncias", authorizeAdminRole, NotificationController.pegarDenuncias);
router.get("/denuncias/post/:id", authorizeAdminRole, NotificationController.pegarPostDenunciado);

router.put("/denuncias/:idDenuncia/:idPost/:status", authorizeAdminRole, NotificationController.atualizarStatusDenuncia);
export default router;
