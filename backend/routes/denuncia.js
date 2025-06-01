import express from 'express';
import DenunciaController from '../controllers/denunciaController.js'; // Ajuste o nome do import
import authenticateToken from '../middleware/authMiddleware.js'; // Ajuste se o nome da exportação for diferente

const router = express.Router();

router.post('/denunciar', authenticateToken, DenunciaController.criarDenuncia);

export default router;