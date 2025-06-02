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

async function listarDenuncias() {
  let connection
  try {
    connection = await getConnection()
    
    const sql = `
      SELECT
          d.DEN_ID AS DEN_ID,
          d.DEN_TIPO AS DEN_TIPO,
          d.DEN_DESCRICAO AS DEN_DESCRICAO,
          d.DEN_DATA AS DEN_DATA,
          d.USU_ID AS ID_DENUNCIANTE_USUARIO,
          p_denunciante.PES_NOME AS NOME_DENUNCIANTE,
          d.POS_ID AS POS_ID,
          p.USU_ID AS ID_USUARIO_DENUNCIADO,
          p_denunciado.PES_NOME AS NOME_DENUNCIADO
      FROM
          DENUNCIAS d
      JOIN
          USUARIO u_denunciante ON d.USU_ID = u_denunciante.USU_ID
      JOIN
          PESSOA p_denunciante ON u_denunciante.PES_ID = p_denunciante.PES_ID 
      JOIN
          POST p ON d.POS_ID = p.POS_ID
      JOIN
          USUARIO u_denunciado ON p.USU_ID = u_denunciado.USU_ID
      JOIN
          PESSOA p_denunciado ON u_denunciado.PES_ID = p_denunciado.PES_ID
      ORDER BY
          d.DEN_DATA DESC
        `;
console.log(" _____________________antes executar ")
const result = await connection.execute(sql, [], { outFormat: OracleDB.OUT_FORMAT_OBJECT });
console.log("depois executar ________________ ")
    console.log(result.rows)
    return result.rows;
    
  } catch (error) {
    console.error("Erro no modelo ao buscar as denúncias:", error);
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
  listarDenuncias
};
