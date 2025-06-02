import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";

async function salvarDenuncia(tipo, descricao, idPost, userId) {
    let connection;

    try {        
      connection = await getConnection();

    const dataAtualObj = new Date();
    const dataAtual = `${String(dataAtualObj.getDate()).padStart(2, '0')}/${String(dataAtualObj.getMonth() + 1).padStart(2, '0')}/${dataAtualObj.getFullYear()}`;

      await connection.execute(
        `INSERT INTO DENUNCIAS (DEN_TIPO, DEN_DESCRICAO, DEN_DATA, USU_ID, POS_ID)
         VALUES (:tipo, :descricao, :data, :userId, :idPost)`,
        {
          tipo,
          descricao,
          data: dataAtual,
          userId,
          idPost,
        },
        { autoCommit: true }
      );
      return { success: true, message: "Denúncia registrada com sucesso!" };
    } catch (error) {
      console.error("Erro ao registrar denúncia no modelo:", error);
      throw new Error("Erro interno ao registrar denúncia.");
    } finally {
      if (connection) await connection.close()
    }
}

export default {
  salvarDenuncia,
};
