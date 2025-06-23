import NotificationService from '../service/NotificationService.js'
import log from '../utils/logger.js'
import HttpError from '../utils/HttpError.js';

class NotificationController{
    static MODULE = 'NotificationController';

    async pegarNotificacoes(req, res){
        log('INFO', this.MODULE, 'pegarNotificacoes', 'INICIO')
        try {
            const notificacoes = await NotificationService.obterNotificacoes(req.user.id);
            log('INFO', this.MODULE, 'pegarNotificacoes', 'FIM')
            return res.status(200).json({ notificacoes });
        } catch (error) {
            log('ERRO', this.MODULE, 'pegarNotificacoes', 'ERRO AO BUSCAR NOTIFICACOES', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao buscar notificações."
            });
        }
    }

    async excluirUmaNotificacao(req, res){
        log('INFO', this.MODULE, 'deletarUmaNotificacao', 'INICIO')
        try {
            await NotificationService.deletarUmaNotificacao(req.params.id, req.user.id);
            log('INFO', this.MODULE, 'deletarUmaNotificacao', 'FIM')
            return res.status(200).json({ message: "Notificação deletada com sucesso." });
        } catch (error) {
            log('ERRO', this.MODULE, 'deletarUmaNotificacao', 'ERRO AO DELETAR NOTIFICACAO', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao deletar notificação."
            });
        }
    }

    async criarEnviarMensagem(req, res){
        log('INFO', this.MODULE, 'criarEnviarMensagem', 'INICIO')
        try {
            const { idPost } = req.body;
            await NotificationService.criarEnviarMensagem(req.user.id, idPost, req.user.email);

            log('INFO', this.MODULE, 'criarEnviarMensagem', 'FIM')
            return res.status(201).json({ message: "Mensagem enviada com sucesso." });
        } catch (error) {
            log('ERRO', this.MODULE, 'criarEnviarMensagem', 'ERRO AO ENVIAR MENSAGEM', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao enviar mensagem."
            });
        }
    }

    async criarUmaDenuncia(req, res){
        log('INFO', this.MODULE, 'criarUmaDenuncia', 'INICIO')
        try {
            await NotificationService.criarDenuncia(req.user.id, req.body);

            log('INFO', this.MODULE, 'criarUmaDenuncia', 'FIM')
            return res.status(201).json({ message: "Denúncia criada com sucesso." });
        } catch (error) {
            log('ERRO', this.MODULE, 'criarUmaDenuncia', 'ERRO AO CRIAR DENUNCIA', error)
            console.log(error);
            return res.status(400).json({ 
                message: "Erro ao criar denúncia."
            });
        }
    }

    async pegarDenuncias(req, res){
        log('INFO', this.MODULE, 'pegarDenuncias', 'INICIO');
        try {
            const denuncias = await NotificationService.listarDenuncias();
            log('INFO', this.MODULE, 'pegarDenuncias', 'FIM');
            return res.status(200).json({ denuncias });
        } catch (error) {
            log('ERRO', this.MODULE, 'pegarDenuncias', 'ERRO ao buscar denuncias');
            console.log(error);
            return res.status(500).json({
                message: "Erro ao buscar as denuncias",
                error: error.message
            });
        }
    }

    async pegarPostDenunciado(req, res){
        log('INFO', this.MODULE, 'pegarPostDenunciado', 'INICIO');
        try {
        const publicacao = await NotificationService.pegarPostDenunciado(req.params.id)
        log('INFO', this.MODULE, 'pegarPostDenunciado', 'FIM');
        return res.status(200).json({ publicacao });
        } catch (error) {
        log('ERRO', this.MODULE, 'pegarPostDenunciado', 'ERRO ao buscar post denunciado');
        console.log(error);
        if ( error instanceof HttpError  ) {        
            log('ERRO', 'AdmController', 'pegarPostDenunciado', 'IF HTTP-ERROR');
            return res.status(error.status).json({error: error.message})
        }
        return res.status(500).json({
            message: "Erro ao buscar o post denunciado",
            error: error.message
        });
        }
    }

    async atualizarStatusDenuncia(req, res){
        log('INFO', this.MODULE, 'atualizarStatusDenuncia', 'INICIO');
        try {
        const result = await NotificationService.atualizarStatusDenuncia(req.params);
        
        log('INFO', this.MODULE, 'atualizarStatusDenuncia', 'FIM');
        return res.status(200).json({ message: "Status da denúncia atualizado com sucesso!", data: result });

        } catch (error) {
        log('ERRO', this.MODULE, 'atualizarStatusDenuncia', 'ERRO ao atualizar status da denúncia');
        console.log(error);
        if (error instanceof HttpError) {
            return res.status(error.status).json({ error: error.message });
        }
        return res.status(500).json({
            message: "Erro ao atualizar o status da denúncia",
            error: error.message
        });
        }
    }
}

export default new NotificationController();