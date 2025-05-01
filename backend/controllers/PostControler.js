import getTodosPosts from "../model/getTodosPosts.js";
import getTipoPostModel from "../model/getTipoPostModel.js";
import getUserPostsModel from "../model/getUserPost.js";

async function todosPosts(req, res) {
    try {
        const posts = await getTodosPosts();
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

async function getUserPosts(req, res) {
    const {email} = req.body; // ID do usuário via corpo da requisição
    try {
        const posts = await getUserPostsModel(email);
        return res.status(200).json({ message: "Os seus posts foram capturados com sucesso", posts });
    } catch (error) {
        console.error("getUserPosts error: ", error)
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
    
    
    
}

export { PostController, todosPosts, getPostEncontrado, getPostPerdido, getUserPosts };
