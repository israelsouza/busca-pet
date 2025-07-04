import express from "express";
import NotificationController from "../controllers/NotificationController.js";
import authorizeAdminRole from "../middleware/authRole.js";
import autenticarToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/criar/mensagem", autenticarToken, NotificationController.criarEnviarMensagem);
router.get("/mensagem", autenticarToken, NotificationController.pegarNotificacoes);
router.delete("/mensagem/:id", autenticarToken, NotificationController.excluirUmaNotificacao);
router.delete("/todas-mensagem", autenticarToken, NotificationController.deletarTodasNotificacoes);
router.post("/criar/denuncia", autenticarToken, NotificationController.criarUmaDenuncia);

router.get("/denuncias", autenticarToken, authorizeAdminRole, NotificationController.pegarDenuncias);
router.get("/denuncias/post/:id", autenticarToken, authorizeAdminRole, NotificationController.pegarPostDenunciado);

router.put("/denuncias/:idDenuncia/:idPost/:status", autenticarToken, authorizeAdminRole, NotificationController.atualizarStatusDenuncia);

export default router;
