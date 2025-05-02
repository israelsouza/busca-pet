import getTodosPosts from "../model/getTodosPosts.js";
import getTipoPostModel from "../model/getTipoPostModel.js";
import getUserPostsModel from "../model/getUserPost.js";
import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";

async function todosPosts(req, res) {
  try {
    const posts = await getTodosPosts();
    return res
      .status(200)
      .json({ message: "Posts capturados com sucesso", posts });
  } catch (error) {
    console.error("todos os posts error: ", error);
    return res.status(500).json({ error: error.message });
  }
}

async function getPostPerdido(req, res) {
  try {
    const tipo = "Perdido";
    const posts = await getTipoPostModel(tipo);
    return res
      .status(200)
      .json({ message: "Posts de pet perdidos capturados com sucesso", posts });
  } catch (error) {
    console.error("getTipoPost perdido error: ", error);
    return res.status(500).json({ error: error.message });
  }
}

async function getPostEncontrado(req, res) {
  try {
    const tipo = "Encontrado";
    const posts = await getTipoPostModel(tipo);
    return res.status(200).json({
      message: "Posts de pet encontrados capturados com sucesso",
      posts,
    });
  } catch (error) {
    console.error("getTipoPost encontrado error: ", error);
    return res.status(500).json({ error: error.message });
  }
}

async function getUserPosts(req, res) {
  const { token } = req.body;
  try {
    const email = await extrairEmailDoToken(token);
    // console.log("email do token: ", email);
    const posts = await getUserPostsModel(email);
    return res
      .status(200)
      .json({ message: "Os seus posts foram capturados com sucesso", posts });
  } catch (error) {
    console.error("getUserPosts error: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export { todosPosts, getPostEncontrado, getPostPerdido, getUserPosts };
