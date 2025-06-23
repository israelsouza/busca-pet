import log from '../utils/logger.js'
import AdmService from '../service/AdmService.js'
import HttpError from '../utils/HttpError.js';

class AdmController {
  async deletarPublicacao(req, res){
    log('INFO', 'AdmController', 'deletarPublicacao', 'INICIO');
    try {
      await AdmService.deletarDadosPost(req.params)
      return res.status(200).json({ message: `PUBLICAÇÃO excluido com sucesso! `});
    } catch (error) {
      log('ERRO', 'AdmController', 'deletarPublicacao', 'ERRO ao deletar publicação');
      console.log(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({
        message: "Erro ao deletar a publicação",
        error: error.message
      });
      
    }
  }

  async atualizarDadoUsuario(req, res){
    log('INFO', 'AdmController', 'atualizarDadoUsuario', 'INICIO');
    try {
      await AdmService.atualizarDadoUsuario(req.params, req.body);

      log('INFO', 'AdmController', 'atualizarDadoUsuario', 'FIM');
      return res.status(200).json({ 
        message: "Usuário atualizado com sucesso!"
      });
    } catch (error) {
      log('ERRO', 'AdmController', 'atualizarDadoUsuario', 'ERRO ao atualizar dados do usuário');
      console.log(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({
        message: "Erro ao atualizar os dados do usuário",
        error: error.message
      });
    }
  }

  async pegarUsuariosEDenuncias(req, res){
    log('INFO', 'AdmController', 'pegarUsuariosEDenuncias', 'INICIO')
    try {
      const usuarios = await AdmService.listarUsuariosEDenuncias()
      log('INFO', 'AdmController', 'pegarUsuariosEDenuncias', 'FIM')
      return res.status(200).json({usuarios});
    } catch (error) {
      log('ERRO', 'AdmController', 'pegarUsuariosEDenuncias', 'ERRO ao buscar usuarios e denuncias')
      console.log(error);      
      return res.status(500).json({ 
        message: "Erro ao buscar usuários", error: error.message
      });
    }
  }

  async banirUsuario(req, res){
    log('INFO', 'AdmController', 'banirUsuario', 'INICIO');
    try {      
      const result = await AdmService.banirUsuario(req.body);      
      log('INFO', 'AdmController', 'banirUsuario', 'FIM');
      return res.status(200).json({ message: "Usuário banido com sucesso!", data: result });
    } catch (error) {
      log('ERRO', 'AdmController', 'banirUsuario', 'ERRO ao banir usuário');
      console.log(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({
        message: "Erro ao banir o usuário",
        error: error.message
      });
    }
  }
}

export default new AdmController();