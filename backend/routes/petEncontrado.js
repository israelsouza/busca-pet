import express from 'express'
import PetEncontradoController from '../controllers/PetEncontradoController.js'
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post("/:email", upload.single("imagem"), PetEncontradoController);

export default router;