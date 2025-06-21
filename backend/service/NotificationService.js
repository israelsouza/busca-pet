import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';
import ValidationUtils from '../utils/ValidationUtils.js';
import { sendMessageToUser } from "../utils/websocket.js";
import NotificationModel from '../model/NotificationModel.js'
import PostModel from '../model/PostModel.js';
import UserModel from '../model/UserModel.js'; 

class NotificationService{
    async obterNotificacoes(id){
        log('INFO', 'UserService', 'obterNotificacoes', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");
        try {
            return await NotificationModel.listarNotificacoes(id)
        } catch (error) {
            log('ERROR', 'UserService', 'obterNotificacoes', "ERRO ao obter as notificações do usuário");
            console.log(error)            
            throw error;
        }
    }

    async deletarUmaNotificacao(idNot, idUser){
        log('INFO', 'UserService', 'deletarUmaNotificacao', 'INICIO');

        if ( !ValidationUtils.validarID(idNot) ) throw new HttpError(400, "ID da notificação inválido");
        if ( !ValidationUtils.validarID(idUser) ) throw new HttpError(400, "ID do usuário inválido");

        try {
            await NotificationModel.deletarNotificacao(idNot, idUser);
            log('INFO', 'UserService', 'deletarUmaNotificacao', 'FIM com sucesso');
        } catch (error) {
            log('ERROR', 'UserService', 'deletarUmaNotificacao', "ERRO ao deletar a notificação");
            console.log(error);
            throw error;
        }
    }

    async criarEnviarMensagem(idRemetente, idPost, emailRemetente){
        log('INFO', 'NotificationService', 'criarEnviarMensagem', 'INICIO');

        if ( !ValidationUtils.validarID(idRemetente) ) throw new HttpError(400, "ID do remetente inválido");
        if ( !ValidationUtils.validarID(idPost) ) throw new HttpError(400, "ID do post inválido");

        try {
            const idDestinatario = await PostModel.findUserIdByPostId(idPost)
            const nomeRemetente = await UserModel.findNameById(idRemetente)
            const phoneRemetente = await UserModel.findPhoneByUserId(idRemetente)

            const msgNotificacao = {
                post: idPost,
                remetente: idRemetente,
                telefone: phoneRemetente,
                email: emailRemetente,
                mensagem: `Olá, parece que o usuário ${nomeRemetente} viu uma publicação sua, confira suas notificações!!`
            }

            const dadosNotificacao = {
                remetente: idRemetente,
                destinatario: idDestinatario,
                conteudo: JSON.stringify(msgNotificacao)
            }

            await NotificationModel.salvarNotificacao(dadosNotificacao);

            const notificacaoEnviada = sendMessageToUser(idDestinatario, msgNotificacao);

            log('INFO', 'NotificationService', 'criarEnviarMensagem', 'FIM com sucesso');

            if (notificacaoEnviada) {
                console.log(`Notificação enviada para o usuário ${idDestinatario} (ONLINE)`);
                return { message: 'Notificação enviada com sucesso!'};
            } else {
                console.log(`Usuário ${idDestinatario} não está online ou a conexão não está aberta. (OFFLINE)`);
                return { message: 'Notificação salva e será entregue quando o usuário estiver online.' };
            }

        } catch (error) {
            log('ERROR', 'NotificationService', 'criarEnviarMensagem', "ERRO ao criar e enviar mensagem");
            console.log(error);
            throw error;
        }
    }
}

export default new NotificationService()