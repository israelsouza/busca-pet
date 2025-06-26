import express from "express";
import upload from "../middleware/multerConfig.js";
import PostController from "../controllers/PostController.js";
import authorizeAdminRole from '../middleware/authRole.js'

const router = express.Router();

router.post("/registrar-pet", upload.single("imagem"), PostController.cadastrarUmPet);

router.get("/meus", PostController.pegarMinhasPublicacoes);
router.get("/:categoria", PostController.pegarPostsPorCategoria);
router.delete("/post/:id", authorizeAdminRole, PostController.deletarPublicacao);

router.get('/buscar/termo', PostController.pegarPostsPorTextoPesquisado)
router.get('/buscar/termo/area', PostController.pegarPostsProximidade)

export default router;
