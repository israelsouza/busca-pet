import express from "express";
import upload from "../middleware/multerConfig.js";
import PostController from "../controllers/PostController.js";
import authorizeAdminRole from '../middleware/authRole.js'
import autenticarToken from "./middleware/authMiddleware.js";

const router = express.Router();

router.post("/registrar-pet",autenticarToken, upload.single("imagem"), PostController.cadastrarUmPet);

router.get("/meus",autenticarToken, PostController.pegarMinhasPublicacoes);
router.get("/:categoria",autenticarToken, PostController.pegarPostsPorCategoria);
router.delete("/post/:id",autenticarToken, authorizeAdminRole, PostController.deletarPublicacao);

router.get('/buscar/termo',autenticarToken, PostController.pegarPostsPorTextoPesquisado)
router.get('/buscar/termo/area',autenticarToken, PostController.pegarPostsProximidade)

export default router;
