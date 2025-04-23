const PostModel = require('../models/PostModel');

class PostController {
    static async fetchAllPosts(req, res) {
        try {
            const posts = await PostModel.getAllPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async fetchUserPosts(req, res) {
        try {
            const userId = req.params.userId; // ID do usuário via parâmetro
            const posts = await PostModel.getUserPosts(userId);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async fetchLostPosts(req, res) {
        try {
            const posts = await PostModel.getPostsByType('Perdido'); // Tipo "Perdido"
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async fetchFoundPosts(req, res) {
        try {
            const posts = await PostModel.getPostsByType('Encontrado'); // Tipo "Encontrado"
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PostController;
