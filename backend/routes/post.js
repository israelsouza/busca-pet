const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router();

router.get('/all', PostController.fetchAllPosts); // Rotas para todos os posts
router.get('/user/:userId', PostController.fetchUserPosts); // Rotas para posts do usuário
router.get('/lost', PostController.fetchLostPosts); // Rotas para pets perdidos
router.get('/found', PostController.fetchFoundPosts); // Rotas para pets encontrados

module.exports = router;
