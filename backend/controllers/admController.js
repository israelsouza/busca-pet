import log from '../utils/logger.js'
import {  
  manterPublicacao,
  deletarPublicacaoPorDenuncia,
  deletarDadosDaPublicacao,
  realizarAtualizacaoUsuario,
  realizarBanimentoEnviarEmail} from '../model/AdmModel.js'

import AdmService from '../service/AdmService.js'
import HttpError from '../utils/HttpError.js';


export async function atualizarStatus(req, res) {
  const { idPost, status, idDenuncia } = req.params
  
  console.log("idPost -> ",idPost)
  console.log("status -> ",status)
  console.log("idDenuncia -> ",idDenuncia)

  if (!status || !idDenuncia || !idPost) {
      return res.status(400).json({ message: 'Ação inválida ou não especificada.' });
  }
  
  try {

    if (status == "MANTER") {    
      const atualizaDenuncia = await manterPublicacao(idDenuncia)
      return res.status(200).json({ message: "Denúncia marcada como mantida com sucesso!" });
    } else if (status === "DELETAR") {
      console.log("entrei em DELETAR");
      const atualizaDenunciaEPublicacao = await deletarPublicacaoPorDenuncia(idDenuncia, idPost)
      return res.status(200).json({ message: `Denúncia atendida e post excluido com sucesso! -->  ${atualizaDenunciaEPublicacao} `});
    } else {
      console.error("ERRO: status inválido")
    }

  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar o status da denuncia:  ", error: error.message });
  }
}

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

export async function banirUsuario(req, res) {
  const {email } = req.params;
  
  try {
    const resultado = await realizarBanimentoEnviarEmail(email);
    console.log(resultado)
    if (resultado.success) {
      return res.status(200).json({ message: 'Usuário banido e notificação enviada com sucesso!' });
    } else {
      return res.status(400).json({ message: resultado.message || 'Não foi possível banir o usuário.' });
    }
  } catch (error) {
    console.error("Erro ao banir usuário:", error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
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

}

export default new AdmController();