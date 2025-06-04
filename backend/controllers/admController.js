import AdmModel from '../model/AdmModel.js'
import { notifyAdmins } from "../utils/websocket.js";
import { getUserIdByEmail } from '../model/getUserId.js'

async function registrarUmaDenuncia(req, res) {
    const { tipo, descricao, idPost } = req.body;
    const emailUser = req.user.email;

    if (!tipo || !descricao || !idPost || !emailUser) {
      return res.status(400).json({ message: 'Dados da denúncia incompletos.' });
    }

    try {

        const userId = await getUserIdByEmail(emailUser)

        const result = await AdmModel.salvarDenuncia(tipo, descricao, idPost, userId)
        
        if (result.success) {
        // Após o sucesso do registro no banco, notifica os administradores
        notifyAdmins({ 
            type: 'novaDenuncia', // Tipo de notificação para diferenciar no front
            message: `Nova denúncia de ${tipo} no Post ID: ${idPost}. Descrição: ${descricao}.`,
            denunciaData: { tipo, descricao, idPost, userId }
        });
            return res.status(201).json({ message: "Denúncia registrada com sucesso!" });
        } else {
        // Se o Model retornar falha (embora o 'throw' seja melhor), lide aqui
            return res.status(500).json({ message: result.message || "Erro ao registrar denúncia." });
        }

        
    } catch (error) {
        console.error("Erro no controller ao criar denúncia:", error);
        return res.status(500).json({ message: error.message || "Erro interno do servidor." });
    }
}

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

export default {
  registrarUmaDenuncia,
  getUsuariosEDenuncias,
  getDenuncias,
  getPublicacaoDenunciada,
  atualizarStatus,
  deletarUmaPublicacao
};
