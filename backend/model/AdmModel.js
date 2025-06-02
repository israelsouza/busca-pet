import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";

async function salvarDenuncia(tipo, descricao, idPost, userId) {
  let connection;

  try {
    connection = await getConnection();

    const dataAtualObj = new Date();
    const dataAtual = `${String(dataAtualObj.getDate()).padStart(
      2,
      "0"
    )}/${String(dataAtualObj.getMonth() + 1).padStart(
      2,
      "0"
    )}/${dataAtualObj.getFullYear()}`;

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
    if (connection) await connection.close();
  }
}

async function listarUsuariosEDenuncias() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `
                SELECT
                    U.USU_ID AS id,
                    P.PES_NOME AS PES_NOME,
                    U.USU_EMAIL AS USU_EMAIL,
                    COUNT(D.DEN_ID) AS denuncias_count
                FROM
                    USUARIO U
                INNER JOIN
                    PESSOA P ON U.PES_ID = P.PES_ID
                LEFT JOIN
                    DENUNCIAS D ON U.USU_ID = D.USU_ID
                GROUP BY
                    U.USU_ID, P.PES_NOME, U.USU_EMAIL
                ORDER BY
                    P.PES_NOME
            `,
      [],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );

    return result.rows;
  } catch (error) {
    console.error("Erro no modelo ao buscar usuários com denúncias:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export default {
  salvarDenuncia,
  listarUsuariosEDenuncias,
};
