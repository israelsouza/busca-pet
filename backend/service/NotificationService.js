import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';
import ValidationUtils from '../utils/ValidationUtils.js';
import SocketService from "../utils/websocket.js";
import NotificationModel from '../model/NotificationModel.js'
import PostModel from '../model/postModel.js';
import UserModel from '../model/UserModel.js'; 

class NotificationService{
    static MODULE = 'NotificationService';
    async obterNotificacoes(id){
        log('INFO', this.MODULE, 'obterNotificacoes', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID do usuário inválido");
        try {
            return await NotificationModel.listarNotificacoes(id)
        } catch (error) {
            log('ERROR', this.MODULE, 'obterNotificacoes', "ERRO ao obter as notificações do usuário");
            console.log(error)            
            throw error;
        }
    }

    async deletarUmaNotificacao(idNot, idUser){
        log('INFO', this.MODULE, 'deletarUmaNotificacao', 'INICIO');

        if ( !ValidationUtils.validarID(idNot) ) throw new HttpError(400, "ID da notificação inválido");
        if ( !ValidationUtils.validarID(idUser) ) throw new HttpError(400, "ID do usuário inválido");

        try {
            await NotificationModel.deletarNotificacao(idNot, idUser);
            log('INFO', this.MODULE, 'deletarUmaNotificacao', 'FIM com sucesso');
        } catch (error) {
            log('ERROR', this.MODULE, 'deletarUmaNotificacao', "ERRO ao deletar a notificação");
            console.log(error);
            throw error;
        }
    }

    async criarEnviarMensagem(idRemetente, idPost, emailRemetente){
        log('INFO', this.MODULE, 'criarEnviarMensagem', 'INICIO');

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

            const notificacaoEnviada = SocketService.sendMessageToUser(idDestinatario, msgNotificacao);

            log('INFO', this.MODULE, 'criarEnviarMensagem', 'FIM com sucesso');

            if (notificacaoEnviada) {
                console.log(`Notificação enviada para o usuário ${idDestinatario} (ONLINE)`);
                return { message: 'Notificação enviada com sucesso!'};
            } else {
                console.log(`Usuário ${idDestinatario} não está online ou a conexão não está aberta. (OFFLINE)`);
                return { message: 'Notificação salva e será entregue quando o usuário estiver online.' };
            }

        } catch (error) {
            log('ERROR', this.MODULE, 'criarEnviarMensagem', "ERRO ao criar e enviar mensagem");
            console.log(error);
            throw error;
        }
    }

    async criarDenuncia(idUsuario, {tipo, descricao, idPost}){
        log('INFO', this.MODULE, 'criarDenuncia', 'INICIO');

        if (!ValidationUtils.validarID(idUsuario)) throw new HttpError(400, "ID do usuário inválido");
        if (!ValidationUtils.validarID(idPost)) throw new HttpError(400, "ID do post inválido");

        if (tipo.length > 100) throw new HttpError(400, "Quantidade caracteres excedido");
        if (descricao.length > 200) throw new HttpError(400, "Quantidade caracteres excedido");

        if (!descricao || descricao.trim() === '') {
            throw new HttpError(400, "A descrição da denúncia é obrigatória");
        }

        try {
            const dataAtualObj = new Date();
            const dataAtual = `${String(dataAtualObj.getDate()).padStart( 2, "0" )}/${String(dataAtualObj.getMonth() + 1).padStart(  2, "0" )}/${dataAtualObj.getFullYear()}`;

            const result = await NotificationModel.salvarUmaDenuncia(idUsuario, idPost, descricao, tipo, dataAtual)

            if (result.success) {
                SocketService.notifyAdmins({ 
                    type: 'nova_denuncia',
                    message: `Nova denúncia de ${tipo} no Post ID: ${idPost}. Descrição: ${descricao}.`,
                    denunciaData: { tipo, descricao, idPost, idUsuario }
                });
            }

            log('INFO', this.MODULE, 'criarDenuncia', 'FIM com sucesso');
            return { message: 'Denúncia enviada com sucesso para a administração.' };
        } catch (error) {
            log('ERROR', this.MODULE, 'criarDenuncia', "ERRO ao criar denúncia");
            console.log(error);
            throw error;
        }
    }

    async listarDenuncias(){
        log('INFO', this.MODULE, 'listarDenuncias', 'INICIO')
        try {
            const denuncias = await NotificationModel.listarDenuncias()
            log('INFO', this.MODULE, 'listarDenuncias', 'FIM')
            return denuncias;
        } catch (error) {
            log('ERRO', this.MODULE, 'listarDenuncias', 'ERRO ao listar as denuncias')
            console.log(error);
            throw error;
        }
    }

    async pegarPostDenunciado(id){
        log('INFO', this.MODULE, 'pegarPostDenunciado', 'INICIO')
        if ( !ValidationUtils.validarID(id) ) throw new HttpError(400, "ID da publicação inválido");
        try {
            const post = await NotificationModel.listaPostDenunciado(id)
            if (post === null) throw new HttpError(400, "Publicação não encontrada");

            const postTratado = await ValidationUtils.tratarImagensEData(post)         
            log('INFO', this.MODULE, 'pegarPostDenunciado', 'POST TRATADO COM SUCESSO')
            log('INFO', this.MODULE, 'pegarPostDenunciado', 'FIM')

            return postTratado[0];
        } catch (error) {
            log('ERRO', this.MODULE, 'pegarPostDenunciado', 'ERRO ao listar a publicação denunciada')
            console.log(error);
            throw error;
        }
        
    }

    async atualizarStatusDenuncia({ idPost, status, idDenuncia }){
        log('INFO', this.MODULE, 'atualizarStatusDenuncia', 'INICIO')
        if (!status || !idDenuncia || !idPost) {
            throw new HttpError(400, 'Ação inválida ou não especificada.');
        }

        console.log("post ", idPost);
        console.log("idDenuncia ", idDenuncia);
        
        status == "MANTER" ? await this.manterPost(idDenuncia) : await this.deletarPost(idPost, idDenuncia);
    }

    async manterPost(id){
        try {
            log('INFO', this.MODULE, 'manterPost', 'INICIO')
            await NotificationModel.manterPost(id);
            log('INFO', this.MODULE, 'manterPost', 'FIM')
        } catch (error) {
            log('ERRO', this.MODULE, 'manterPost', 'ERRO ao manter o post denunciado')
            console.log(error);
            throw error;
        }
    }

    async deletarPost(idPost, idDenuncia){
        try {
            log('INFO', this.MODULE, 'deletarPost', 'INICIO')
            await NotificationModel.deletarPostPorDenuncia(idPost, idDenuncia);
            log('INFO', this.MODULE, 'deletarPost', 'FIM')
        } catch (error) {
            log('ERRO', this.MODULE, 'deletarPost', 'ERRO ao excluir o post denunciado')
            console.log(error);
            throw error;
        }
    }
}

export default new NotificationService()