import getConnection from "./connectionOracle.js";
import notifyAdmins from '../utils/websocket.js'; 

const DenunciaModel = {
  async criar({ tipo, descricao, usuarioId, petId }) {
    const connection = await getConnection();

    try {
      connection = await connectionOracle.getConnection();
      const dataAtual = new Date();

      await connection.execute(
        `INSERT INTO DENUNCIAS (DEN_TIPO, DEN_DESCRICAO, DEN_DATA, USU_ID, PET_ID)
         VALUES (:tipo, :descricao, :data, :usuarioId, :petId)`,
        {
          tipo,
          descricao,
          data: dataAtual,
          usuarioId,
          petId,
        },
        { autoCommit: true }
      );
      return { success: true, message: "Denúncia registrada com sucesso!" };
    } catch (error) {
      console.error("Erro ao registrar denúncia no modelo:", error);
      throw new Error("Erro interno ao registrar denúncia.");
    } finally {
      if (connection) {
        await connectionOracle.releaseConnection(connection);
      }
    }
   
      notifyAdmins(`Nova denúncia: ${tipo} - ${descricao}`);

  },
};

export default DenunciaModel;
