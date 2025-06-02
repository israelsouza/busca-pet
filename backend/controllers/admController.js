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

export default {
  registrarUmaDenuncia,
};
