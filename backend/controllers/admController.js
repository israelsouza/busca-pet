import log from '../utils/logger.js'
import {  
  deletarDadosDaPublicacao,
  realizarAtualizacaoUsuario,
} from '../model/AdmModel.js'

import AdmService from '../service/AdmService.js'
import HttpError from '../utils/HttpError.js';


export async function deletarUmaPublicacao(req, res) {
  const {idPost} = req.params;

  if(!idPost)
      return res.status(400).json({ message: 'Ação inválida ou não especificada.' });

  try {    
    const result = await deletarDadosDaPublicacao(idPost);
    console.log(result)
    return res.status(200).json({ message: `PUBLICAÇÃO excluido com sucesso! `});
    
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar a publicação:  ", error: error.message });
  }
  
}

export async function atualizarUnicoUsuario(req, res) {
  console.log("ENTREI NO BACKEND -> atualizarUnicoUsuario")
  const userId = req.params.id;
  const { nome, email, senha } = req.body;

  try {
        
    const operacao = realizarAtualizacaoUsuario(userId, nome, email, senha)

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
    
}

class AdmController {
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

  async pegarDenuncias(req, res){
    log('INFO', 'AdmController', 'pegarDenuncias', 'INICIO');
    try {
      const denuncias = await AdmService.listarDenuncias();
      log('INFO', 'AdmController', 'pegarDenuncias', 'FIM');
      return res.status(200).json({ denuncias });
    } catch (error) {
      log('ERRO', 'AdmController', 'pegarDenuncias', 'ERRO ao buscar denuncias');
      console.log(error);
      return res.status(500).json({
      message: "Erro ao buscar as denuncias",
      error: error.message
      });
    }
  }

  async pegarPostDenunciado(req, res){
    log('INFO', 'AdmController', 'pegarPostDenunciado', 'INICIO');
    try {
      const publicacao = await AdmService.pegarPostDenunciado(req.params.id)
      log('INFO', 'AdmController', 'pegarPostDenunciado', 'FIM');
      return res.status(200).json({ publicacao });
    } catch (error) {
      log('ERRO', 'AdmController', 'pegarPostDenunciado', 'ERRO ao buscar post denunciado');
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
    log('INFO', 'AdmController', 'atualizarStatusDenuncia', 'INICIO');
    try {
      const result = await AdmService.atualizarStatusDenuncia(req.params);
      
      log('INFO', 'AdmController', 'atualizarStatusDenuncia', 'FIM');
      return res.status(200).json({ message: "Status da denúncia atualizado com sucesso!", data: result });

    } catch (error) {
      log('ERRO', 'AdmController', 'atualizarStatusDenuncia', 'ERRO ao atualizar status da denúncia');
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