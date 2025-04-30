import PostModel from "../model/postModel";

class PostController {
    static async fetchAllPosts(req, res) {
        try {
            const posts = await PostModel.getAllPosts();
            const processedPosts = posts.map(post => ({
                ...post,
                USU_FOTO: post.USU_FOTO ? post.USU_FOTO.toString("base64") : null, // Conversão da imagem do usuário
                PET_FOTO: post.PET_FOTO ? post.PET_FOTO.toString("base64") : null  // Conversão da imagem do pet
            }));
            res.json(processedPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async fetchUserPosts(req, res) {
        try {
            const userId = req.params.userId; // ID do usuário via parâmetro
            const posts = await PostModel.getUserPosts(userId);
            const processedPosts = posts.map(post => ({
                ...post,
                USU_FOTO: post.USU_FOTO ? post.USU_FOTO.toString("base64") : null,
                PET_FOTO: post.PET_FOTO ? post.PET_FOTO.toString("base64") : null
            }));
            res.json(processedPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async fetchLostPosts(req, res) {
        try {
            const posts = await PostModel.getPostsByType('Perdido');
            const processedPosts = posts.map(post => ({
                ...post,
                USU_FOTO: post.USU_FOTO ? post.USU_FOTO.toString("base64") : null,
                PET_FOTO: post.PET_FOTO ? post.PET_FOTO.toString("base64") : null
            }));
            res.json(processedPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async fetchFoundPosts(req, res) {
        try {
            const posts = await PostModel.getPostsByType('Encontrado');
            const processedPosts = posts.map(post => ({
                ...post,
                USU_FOTO: post.USU_FOTO ? post.USU_FOTO.toString("base64") : null,
                PET_FOTO: post.PET_FOTO ? post.PET_FOTO.toString("base64") : null
            }));
            res.json(processedPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
}

export default PostController;
