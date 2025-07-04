import log from "../utils/logger.js";
import HttpError from "../utils/HttpError.js";
import ValidationUtils from "../utils/ValidationUtils.js";
import SocketService from "../utils/websocket.js";
import NotificationModel from "../model/NotificationModel.js";
import PostModel from "../model/PostModel.js";
import UserModel from "../model/UserModel.js";

class NotificationService {
  async obterNotificacoes(id) {
    log("INFO", "NotificationService", "obterNotificacoes", "INICIO");
    if (!ValidationUtils.validarID(id))
      throw new HttpError(400, "ID do usuário inválido");
    try {
      return await NotificationModel.listarNotificacoes(id);
    } catch (error) {
      log(
        "ERROR",
        "NotificationService",
        "obterNotificacoes",
        "ERRO ao obter as notificações do usuário"
      );
      console.log(error);
      throw error;
    }
  }

  async deletarUmaNotificacao(idNot, idUser) {
    log("INFO", "NotificationService", "deletarUmaNotificacao", "INICIO");

    if (!ValidationUtils.validarID(idNot))
      throw new HttpError(400, "ID da notificação inválido");
    if (!ValidationUtils.validarID(idUser))
      throw new HttpError(400, "ID do usuário inválido");

    try {
      await NotificationModel.deletarNotificacao(idNot, idUser);
      log(
        "INFO",
        "NotificationService",
        "deletarUmaNotificacao",
        "FIM com sucesso"
      );
    } catch (error) {
      log(
        "ERROR",
        "NotificationService",
        "deletarUmaNotificacao",
        "ERRO ao deletar a notificação"
      );
      console.log(error);
      throw error;
    }
  }

  async deletarTodasNotificacoes(idUser) {
    console.log(idUser, " ID no modulo NotificationService");

    log("INFO", "NotificationService", "deletarTodasNotificacoes", "INICIO");

    if (!ValidationUtils.validarID(idUser))
      throw new HttpError(400, "ID do usuário inválido");

    try {
      await NotificationModel.deletarTodasNotificacoes(idUser);
      log(
        "INFO",
        "NotificationService",
        "deletarTodasNotificacoes",
        "FIM com sucesso"
      );
    } catch (error) {
      log(
        "ERROR",
        "NotificationService",
        "deletarTodasNotificacoes",
        "ERRO ao deletar a notificação"
      );
      console.log(error);
      throw error;
    }
  }

  async criarEnviarMensagem(idRemetente, idPost, emailRemetente) {
    log("INFO", "NotificationService", "criarEnviarMensagem", "INICIO");

    if (!ValidationUtils.validarID(idRemetente))
      throw new HttpError(400, "ID do remetente inválido");
    if (!ValidationUtils.validarID(idPost))
      throw new HttpError(400, "ID do post inválido");

    try {
      const idDestinatario = await PostModel.findUserIdByPostId(idPost);
      const nomeRemetente = await UserModel.findNameById(idRemetente);
      const phoneRemetente = await UserModel.findPhoneByUserId(idRemetente);

      console.log(
        "ID do destinatário: ",
        idDestinatario,
        " ID do remetente: ",
        idRemetente,
        " ID do post: ",
        idPost
      );

      const msgNotificacao = {
        post: idPost,
        remetente: idRemetente,
        telefone: phoneRemetente,
        email: emailRemetente,
        mensagem: `Olá, parece que o usuário ${nomeRemetente} viu uma publicação sua, confira suas notificações!!`,
      };

      const dadosNotificacao = {
        remetente: idRemetente,
        destinatario: idDestinatario,
        conteudo: JSON.stringify(msgNotificacao),
      };

      await NotificationModel.salvarNotificacao(dadosNotificacao);

      const notificacaoEnviada = SocketService.sendMessageToUser(
        idDestinatario,
        msgNotificacao
      );

      log(
        "INFO",
        "NotificationService",
        "criarEnviarMensagem",
        "FIM com sucesso"
      );

      if (notificacaoEnviada) {
        console.log(
          `Notificação enviada para o usuário ${idDestinatario} (ONLINE)`
        );
        return { message: "Notificação enviada com sucesso!" };
      } else {
        console.log(
          `Usuário ${idDestinatario} não está online ou a conexão não está aberta. (OFFLINE)`
        );
        return {
          message:
            "Notificação salva e será entregue quando o usuário estiver online.",
        };
      }
    } catch (error) {
      log(
        "ERROR",
        "NotificationService",
        "criarEnviarMensagem",
        "ERRO ao criar e enviar mensagem"
      );
      console.log(error);
      throw error;
    }
  }

  async criarDenuncia(idUsuario, { tipo, descricao, idPost }) {
    log("INFO", "NotificationService", "criarDenuncia", "INICIO");

    if (!ValidationUtils.validarID(idUsuario))
      throw new HttpError(400, "ID do usuário inválido");
    if (!ValidationUtils.validarID(idPost))
      throw new HttpError(400, "ID do post inválido");

    if (tipo.length > 100)
      throw new HttpError(400, "Quantidade caracteres excedido");
    if (descricao.length > 200)
      throw new HttpError(400, "Quantidade caracteres excedido");

    if (!descricao || descricao.trim() === "") {
      throw new HttpError(400, "A descrição da denúncia é obrigatória");
    }

    try {
      const dataAtualObj = new Date();
      const dataAtual = `${String(dataAtualObj.getDate()).padStart(
        2,
        "0"
      )}/${String(dataAtualObj.getMonth() + 1).padStart(
        2,
        "0"
      )}/${dataAtualObj.getFullYear()}`;

      const result = await NotificationModel.salvarUmaDenuncia(
        idUsuario,
        idPost,
        descricao,
        tipo,
        dataAtual
      );

      if (result.success) {
        SocketService.notifyAdmins({
          type: "nova_denuncia",
          message: `Nova denúncia de ${tipo} no Post ID: ${idPost}. Descrição: ${descricao}.`,
          denunciaData: { tipo, descricao, idPost, idUsuario },
        });
      }

      log("INFO", "NotificationService", "criarDenuncia", "FIM com sucesso");
      return { message: "Denúncia enviada com sucesso para a administração." };
    } catch (error) {
      log(
        "ERROR",
        "NotificationService",
        "criarDenuncia",
        "ERRO ao criar denúncia"
      );
      console.log(error);
      throw error;
    }
  }

  async listarDenuncias() {
    log("INFO", "NotificationService", "listarDenuncias", "INICIO");
    try {
      const denuncias = await NotificationModel.listarDenuncias();
      log("INFO", "NotificationService", "listarDenuncias", "FIM");
      return denuncias;
    } catch (error) {
      log(
        "ERRO",
        "NotificationService",
        "listarDenuncias",
        "ERRO ao listar as denuncias"
      );
      console.log(error);
      throw error;
    }
  }

  async pegarPostDenunciado(id) {
    log("INFO", "NotificationService", "pegarPostDenunciado", "INICIO");
    if (!ValidationUtils.validarID(id))
      throw new HttpError(400, "ID da publicação inválido");
    try {
      const post = await NotificationModel.listaPostDenunciado(id);
      if (post === null) throw new HttpError(400, "Publicação não encontrada");

      const postTratado = await ValidationUtils.tratarImagensEData(post);
      log(
        "INFO",
        "NotificationService",
        "pegarPostDenunciado",
        "POST TRATADO COM SUCESSO"
      );
      log("INFO", "NotificationService", "pegarPostDenunciado", "FIM");

      return postTratado[0];
    } catch (error) {
      log(
        "ERRO",
        "NotificationService",
        "pegarPostDenunciado",
        "ERRO ao listar a publicação denunciada"
      );
      console.log(error);
      throw error;
    }
  }

  async atualizarStatusDenuncia({ idPost, status, idDenuncia }) {
    log("INFO", "NotificationService", "atualizarStatusDenuncia", "INICIO");
    if (!status || !idDenuncia || !idPost) {
      throw new HttpError(400, "Ação inválida ou não especificada.");
    }

    console.log("post ", idPost);
    console.log("idDenuncia ", idDenuncia);

    status == "MANTER"
      ? await this.manterPost(idDenuncia)
      : await this.deletarPost(idPost, idDenuncia);
  }

  async manterPost(id) {
    try {
      log("INFO", "NotificationService", "manterPost", "INICIO");
      await NotificationModel.manterPost(id);
      log("INFO", "NotificationService", "manterPost", "FIM");
    } catch (error) {
      log(
        "ERRO",
        "NotificationService",
        "manterPost",
        "ERRO ao manter o post denunciado"
      );
      console.log(error);
      throw error;
    }
  }

  async deletarPost(idPost, idDenuncia) {
    try {
      log("INFO", "NotificationService", "deletarPost", "INICIO");
      await NotificationModel.deletarPostPorDenuncia(idPost, idDenuncia);
      log("INFO", "NotificationService", "deletarPost", "FIM");
    } catch (error) {
      log(
        "ERRO",
        "NotificationService",
        "deletarPost",
        "ERRO ao excluir o post denunciado"
      );
      console.log(error);
      throw error;
    }
  }
}

export default new NotificationService();
