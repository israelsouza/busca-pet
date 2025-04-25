import getConnection from "./connectionOracle";

async function invalidarTokensAntigos(usuarioId) {
    try {
      const connection = await getConnection();
      const sqlQuery = `
        DELETE FROM RECUPERAR_SENHA
        WHERE USU_ID = :idUser
        AND REC_DTLIMITE > SYSDATE
      `;
      const binds = {
        idUser: usuarioId
      };
      await connection.execute(sqlQuery, binds, { autoCommit: true });
      await connection.close();
      return true;
    } catch (error) {
      console.error("Erro ao invalidar tokens antigos:", error);
      // Decida se você quer lançar o erro novamente ou apenas logar
      throw new Error("Erro ao invalidar tokens antigos");
    }
}

export default invalidarTokensAntigos;