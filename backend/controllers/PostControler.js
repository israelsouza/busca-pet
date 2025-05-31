import {getTodosOsPosts} from "../model/getTodosPosts.js";
import {getMinhasPublicacoesModel} from '../model/minhasPublicacoesModel.js'
import getTipoPostModel from "../model/getTipoPostModel.js";
import getIdFromPost from "../model/getIdFromPost.js";
import getPostsDoUsuario  from "../model/getPostsUsuarioModel.js";
import { sendMessageToUser } from "../utils/websocket.js";
import salvarNotificacaoUsuario from '../model/salvarNotificacao.js'
import getUserId from "../model/getUserId.js";
import getPhoneFromId from "../model/getPhoneFromId.js";
import {
  getPostsPorTextoModel,
  getPetsNaRegiaoModel
} from '../model/PostModel.js'

function formatarDataParaDDMMYYYY(data) {
  const [ano, mes, dia] = data.split("-"); // Supondo que a data recebida seja no formato YYYY-MM-DD
  return `${dia}-${mes}-${ano}`;
}

export async function getMinhasPublicacoes(req, res) {
  const email = req.user.email;


  try {
    const myPosts = await getMinhasPublicacoesModel(email);
    return res.status(200).json({message:"Ok", myPosts})
    
  } catch (error) {
    console.error("meus posts error: ", error);
    return res.status(500).json({ error: error.message });
  }


  
}

export async function todosPosts(req, res) {


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

export async function getPostPerdido(req, res) {
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

export async function getPostEncontrado(req, res) {
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

export async function getQuemPublicou(req, res) {
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


export async function getPetsPorArea(req, res) {
  try {
      const latPesquisa = parseFloat(req.query.lat);
      const lngPesquisa = parseFloat(req.query.lng);
      const raioKm = parseFloat(req.query.raio || 4);

      // console.log(latPesquisa)
      // console.log(lngPesquisa)
      // console.log(raioKm)

      if (isNaN(latPesquisa) || isNaN(lngPesquisa) || isNaN(raioKm) || raioKm <= 0) {
          return res.status(400).json({ message: 'Parâmetros de latitude, longitude ou raio inválidos.' });
      }

      const consultaNaoFormatada = await getPetsNaRegiaoModel(latPesquisa, lngPesquisa, raioKm);
      console.log(consultaNaoFormatada)


      const consulta = consultaNaoFormatada.map( (row) => ({
        ...row,
        PET_FOTO: row.PET_FOTO
        ? `data:image/jpeg;base64,${row.PET_FOTO.toString("base64")}`
        : null,
        PET_DATA: row.PET_DATA
        ? formatarDataParaDDMMYYYY(
            new Date(row.PET_DATA).toISOString().split("T")[0]
          )
        : null,
      }))
  
      return res.status(200).json({messagem: "Sucesso", consulta, radius: raioKm})
  } catch (error) {
    console.error(error)
    //return res.status(500).json({messagem: "Erro Interno"})
  }
}

export async function getPostsPorTexto(req, res) {
  const termoBuscado = req.query.q;
  console.log("B-CONTROLLER-POST: Entrei")
  console.log("B-CONTROLLER-POST: Termo Buscado -> ", termoBuscado)
  
  try {
    const result = await getPostsPorTextoModel(termoBuscado);
    console.log(result)

    // Converte USU_FOTO binário para base64, se existir
    if (Array.isArray(result)) {
      result.forEach(post => {
      if (post.USU_FOTO && Buffer.isBuffer(post.USU_FOTO)) {
        post.USU_FOTO = post.USU_FOTO.toString('base64');
      }
      });
    }

    return res.status(200).json({message:"Sucesso na requisição", result})
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:"Erro interno"})
  }

}

export { getPostsUsuario, todosPosts, getPostEncontrado, getPostPerdido, getQuemPublicou };

