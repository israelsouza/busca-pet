import express from 'express'
import {PostController, todosPosts} from '../controllers/PostControler.js';

const router = express.Router();

// console.log("entrei aqui no model de getALL") ESTA LENDO

router.get('/all', todosPosts); // Rotas para todos os posts

router.get('/user/:userId', PostController.fetchUserPosts); // Rotas para posts do usuário
router.get('/lost', PostController.fetchLostPosts); // Rotas para pets perdidos
router.get('/found', PostController.fetchFoundPosts); // Rotas para pets encontrados

export default router;
