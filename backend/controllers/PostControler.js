import PostModel from "../model/postModel.js";
import getTipoPostModel from "../model/getTipoPostModel.js";

async function todosPosts(req, res) {
    try {
        const posts = await PostModel();
        return res.status(200).json({ message: "Posts capturados com sucesso", posts });
    } catch (error) {
        console.error("todos os posts error: ", error)
        return res.status(500).json({ error: error.message, });
    }
}

async function getPostPerdido(req, res) {
    try {
        const tipo = "Perdido";
        const posts = await getTipoPostModel(tipo);
        return res.status(200).json({ message: "Posts de pet perdidos capturados com sucesso", posts });
    } catch (error) {
        console.error("getTipoPost perdido error: ", error)
        return res.status(500).json({ error: error.message, });
    }
}

async function getPostEncontrado(req, res) {
    try {
        const tipo = "Encontrado";
        const posts = await getTipoPostModel(tipo);
        return res.status(200).json({ message: "Posts de pet encontrados capturados com sucesso", posts });
    } catch (error) {
        console.error("getTipoPost encontrado error: ", error)
        return res.status(500).json({ error: error.message, });
    }
}






class PostController {
    
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

export { PostController, todosPosts, getPostEncontrado, getPostPerdido };
