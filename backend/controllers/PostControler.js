import getTodosOsPosts from "../model/getTodosPosts.js";
import getTipoPostModel from "../model/getTipoPostModel.js";
import getIdFromPost from "../model/getIdFromPost.js";
import { sendMessageToUser } from "../utils/websocket.js";
import salvarNotificacaoUsuario from '../model/salvarNotificacao.js'
import getUserId from "../model/getUserId.js";

async function todosPosts(req, res) {
  try {
    const posts = await getTodosOsPosts();
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

async function getQuemPublicou(req, res) {
  const { idPost } = req.body;
  const userA = req.user.email;

  console.log(`B-CONTroller: Entrou em getQuemPublicou || ${userA}`);

  try {
    const idUserA = await getUserId(userA);
    const idUserB = await getIdFromPost(idPost);

    const mensagemNotificacao = {
      type: "pet_encontrado",
      remetente: idUserA,
      publicacaoId: idPost,
      message: `@${idUserA} encontrou o seu pet!! E-mail: ${userA}`,
    };

    const notificationData = {
      rementente: idUserA,
      destinatario: idUserB,
      type: 'pet_encontrado',
      conteudo: JSON.stringify(mensagemNotificacao)
    }

    const idNotificacaoSalva = await salvarNotificacaoUsuario(notificationData);

    console.log("Notificação -> ", idNotificacaoSalva)
   


    console.log(`B-CONTroller: SAIU De getQuemPublicou || ${userA}`);
  } catch (error) {
    console.error(error);
  }
}

export { todosPosts, getPostEncontrado, getPostPerdido, getQuemPublicou };
