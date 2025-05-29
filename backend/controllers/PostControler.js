import getTodosOsPosts from "../model/getTodosPosts.js";
import getTipoPostModel from "../model/getTipoPostModel.js";
import getIdFromPost from "../model/getIdFromPost.js";
import getPostsDoUsuario  from "../model/getPostsUsuarioModel.js";
import { sendMessageToUser } from "../utils/websocket.js";
import salvarNotificacaoUsuario from '../model/salvarNotificacao.js'
import getUserId from "../model/getUserId.js";
import getPhoneFromId from "../model/getPhoneFromId.js";


async function getPostsUsuario(req, res) {
  try {
    const email = req.user.email; // usuário autenticado pelo token
    const posts = await getPostsDoUsuario(email);
    return res.status(200).json({ message: "Posts do usuário retornados", posts });
  } catch (error) {
    console.error("Erro ao buscar posts do usuário:", error);
    return res.status(500).json({ error: error.message });
  }
}

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
    const telefone = await getPhoneFromId(idUserA);

    console.log(telefone)

    const mensagemNotificacao = {
      publicacaoId: idPost,
      remetente: idUserA,
      telefone: telefone,
      email: userA
    };

    const notificationData = {
      rementente: idUserA,
      destinatario: idUserB,
      conteudo: JSON.stringify(mensagemNotificacao)
    }

    const idNotificacaoSalva = await salvarNotificacaoUsuario(notificationData);
    console.log("Notificação -> ", idNotificacaoSalva)


    const notificacaoEnviada = sendMessageToUser(idUserB, mensagemNotificacao);

    if (notificacaoEnviada) {
      console.log(`Notificação enviada para o usuário ${idUserB} (ONLINE)`);
      return res.status(200).json({ message: 'Notificação enviada com sucesso!' });
    } else {
      console.log(`Usuário ${idUserB} não está online ou a conexão não está aberta. (OFFLINE)`);
      return res.status(200).json({ message: 'Notificação salva e será entregue quando o usuário estiver online.' });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar a notificação.", error });
  }
}

export { getPostsUsuario, todosPosts, getPostEncontrado, getPostPerdido, getQuemPublicou };
