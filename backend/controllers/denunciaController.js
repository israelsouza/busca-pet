import { notifyAdmins } from "../utils/websocket.js";
import DenunciaModel from "../model/DenunciaNova.js";

const DenunciaController = {
async criarDenuncia(req, res) {
  try {
    const { tipo, descricao, petId } = req.body;
    const usuarioId = req.usuarioId;

    if (!tipo || !descricao || !petId || !usuarioId) {
      return res.status(400).json({ message: 'Dados da denúncia incompletos.' });
    }

    const result = await DenunciaModel.criar({ tipo, descricao, usuarioId, petId });
    if (result.success) {
      // Após o sucesso do registro no banco, notifica os administradores
      notifyAdmins({ 
        type: 'novaDenuncia', // Tipo de notificação para diferenciar no front
        message: `Nova denúncia de ${tipo} no Post ID: ${petId}. Descrição: ${descricao}.`,
        denunciaData: { tipo, descricao, petId, usuarioId }
      });
      res.status(201).json({ message: "Denúncia registrada com sucesso!" });
    } else {
      // Se o Model retornar falha (embora o 'throw' seja melhor), lide aqui
      res.status(500).json({ message: result.message || "Erro ao registrar denúncia." });
    }

  } catch (error) {
    console.error("Erro no controller ao criar denúncia:", error);
    res.status(500).json({ message: error.message || "Erro interno do servidor." });
  }
}
};

export default DenunciaController;