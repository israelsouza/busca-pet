import AdmModel from '../model/AdmModel.js'

async function getUsuariosEDenuncias(req, res) {
  try {
    const usuarios = await AdmModel.listarUsuariosEDenuncias();
    return res.status(200).json({usuarios});
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
}

async function getDenuncias(req, res) {
  try {
    const denuncias = await AdmModel.listarDenuncias();
    return res.status(200).json({denuncias});
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar as denuncias", error: error.message });
  }
}

async function getPublicacaoDenunciada(req, res) {
  const id = req.params.id
  try {
    const publicacao = await AdmModel.pegarPublicacao(id); 
    return res.status(200).json({publicacao});
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar aa publicacao ", error: error.message });
  }
}

async function atualizarStatus(req, res) {
  const { idPost, status, idDenuncia } = req.params
  
  console.log("idPost -> ",idPost)
  console.log("status -> ",status)
  console.log("idDenuncia -> ",idDenuncia)

  if (!status || !idDenuncia || !idPost) {
      return res.status(400).json({ message: 'Ação inválida ou não especificada.' });
  }
  
  try {

    if (status == "MANTER") {    
      const atualizaDenuncia = await AdmModel.manterPublicacao(idDenuncia)
      return res.status(200).json({ message: "Denúncia marcada como mantida com sucesso!" });
    } else if (status === "DELETAR") {
      console.log("entrei em DELETAR");
      const atualizaDenunciaEPublicacao = await AdmModel.deletarPublicacaoPorDenuncia(idDenuncia, idPost)
      return res.status(200).json({ message: `Denúncia atendida e post excluido com sucesso! -->  ${atualizaDenunciaEPublicacao} `});
    } else {
      console.error("ERRO: status inválido")
    }

  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar o status da denuncia:  ", error: error.message });
  }
}

async function deletarUmaPublicacao(req, res) {
  const {idPost} = req.params;

  if(!idPost)
      return res.status(400).json({ message: 'Ação inválida ou não especificada.' });

  try {    
    const result = await AdmModel.deletarDadosDaPublicacao(idPost);
    console.log(result)
    return res.status(200).json({ message: `PUBLICAÇÃO excluido com sucesso! `});
    
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar a publicação:  ", error: error.message });
  }
  
}

async function atualizarUnicoUsuario(req, res) {
  console.log("ENTREI NO BACKEND -> atualizarUnicoUsuario")
  const userId = req.params.id;
  const { nome, email, senha } = req.body;

  try {
        
    const operacao = AdmModel.realizarAtualizacaoUsuario(userId, nome, email, senha)

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
    
}

async function banirUsuario(req, res) {
  const {email } = req.params;
  
  try {
    const resultado = await AdmModel.realizarBanimentoEnviarEmail(email);
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

export default {
  getUsuariosEDenuncias,
  getDenuncias,
  getPublicacaoDenunciada,
  atualizarStatus,
  deletarUmaPublicacao,
  atualizarUnicoUsuario,
  banirUsuario
};
