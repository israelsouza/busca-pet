import express from "express";
import {
  getPostPerdido,
  todosPosts,
  getPostEncontrado,
} from "../controllers/PostControler.js";

const router = express.Router();

// console.log("entrei aqui no model de getALL") ESTA LENDO

router.get("/all", todosPosts); // Rotas para todos os posts
router.get("/lost", getPostPerdido); // Rotas para pets perdidos
router.get("/found", getPostEncontrado); // Rotas para pets encontrados

// router.get('/user/:userId', PostController.fetchUserPosts); // Rotas para posts do usuário

export default router;
