import express from "express";
import NotificationController from '../controllers/NotificationController.js'

const router = express.Router();

router.post('/criar/mensagem', NotificationController.criarEnviarMensagem)
router.post('/criar/denuncia', NotificationController.criarUmaDenuncia)
router.get("/mensagem", NotificationController.pegarNotificacoes);
router.delete('/mensagem/:id', NotificationController.excluirUmaNotificacao)

// para notificacao
// o mesmo post nao pode ser notificado pelo mesmo usuario mais de uma vez
// quando deletar um post, toda notificação de qualquer usuario referente a esse post deve ser deletado tambem

export default router;
