import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';
import ValidationUtils from '../utils/ValidationUtils.js';
import NotificationModel from '../model/NotificationModel.js'

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
}

export default new NotificationService()