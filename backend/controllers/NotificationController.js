import NotificationService from '../service/NotificationService.js'
import log from '../utils/logger.js'

class NotificationController{
    async pegarNotificacoes(req, res){
        log('INFO', 'UserController', 'pegarNotificacoes', 'INICIO')
        try {
            const notificacoes = await NotificationService.obterNotificacoes(req.user.id);
            log('INFO', 'UserController', 'pegarNotificacoes', 'FIM')
            return res.status(200).json({ notificacoes });
        } catch (error) {
            log('ERRO', 'UserController', 'pegarNotificacoes', 'ERRO AO BUSCAR NOTIFICACOES', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao buscar notificações."
            });
        }
    }

    async excluirUmaNotificacao(req, res){
        log('INFO', 'UserController', 'deletarUmaNotificacao', 'INICIO')
        try {
            await NotificationService.deletarUmaNotificacao(req.params.id, req.user.id);
            log('INFO', 'UserController', 'deletarUmaNotificacao', 'FIM')
            return res.status(200).json({ message: "Notificação deletada com sucesso." });
        } catch (error) {
            log('ERRO', 'UserController', 'deletarUmaNotificacao', 'ERRO AO DELETAR NOTIFICACAO', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao deletar notificação."
            });
        }
    }
}

export default new NotificationController();