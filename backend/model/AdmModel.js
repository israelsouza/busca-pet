import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import formatarDataParaDDMMYYYY from '../utils/formatarData.js'
import readLobAsBase64 from '../utils/converteLobBase64.js';

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
                COALESCE(DenunciasRecebidas.count_denuncias_recebidas, 0) AS denuncias_recebidas_count
          FROM
              USUARIO U
          INNER JOIN
              PESSOA P ON U.PES_ID = P.PES_ID
          LEFT JOIN (
                      SELECT
                          POST.USU_ID AS ID_DO_DONO_DO_POST, 
                          COUNT(DENUNCIAS.DEN_ID) AS count_denuncias_recebidas
                      FROM
                          DENUNCIAS
                      INNER JOIN
                          POST ON DENUNCIAS.POS_ID = POST.POS_ID
                      GROUP BY
                          POST.USU_ID 
                  ) DenunciasRecebidas ON U.USU_ID = DenunciasRecebidas.ID_DO_DONO_DO_POST
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
          d.POS_ID AS POS_ID,            
          p_denunciado.PES_NOME AS NOME_DENUNCIADO,
          p_denunciante.PES_NOME AS NOME_DENUNCIANTE,

          d.DEN_DATA AS DEN_DATA,
          d.USU_ID AS ID_DENUNCIANTE_USUARIO,
      FROM
          DENUNCIAS d
      JOIN
          POST p ON d.POS_ID = p.POS_ID
      JOIN
          USUARIO u_denunciado ON p.USU_ID = u_denunciado.USU_ID
      JOIN
          PESSOA p_denunciado ON u_denunciado.PES_ID = p_denunciado.PES_ID
      JOIN
          USUARIO u_denunciante ON d.USU_ID = u_denunciante.USU_ID 
      JOIN
          PESSOA p_denunciante ON u_denunciante.PES_ID = p_denunciante.PES_ID
      WHERE
          d.DEN_STATUS = 'aberto'
      ORDER BY
          d.DEN_ID DESC
        `;

const result = await connection.execute(sql, [], { outFormat: OracleDB.OUT_FORMAT_OBJECT });

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

async function pegarPublicacao(idPost) {
  let connection;
  console.log("entrei pegarPublicacao(idPost) MODEL ->", idPost)
  try {
    connection = await getConnection();

    const sql = `
       SELECT
          post.POS_ID AS "POS_ID",
          post.POS_TIPO AS "POS_TIPO",
          pet.PET_NOME AS "PET_NOME",
          pet.PET_DESCRICAO AS "PET_DESCRICAO",
          pet.PET_FOTO AS "PET_FOTO",
          pet.PET_LOCAL AS "PET_LOCAL",
          pet.PET_DATA AS "POS_DATA",
          pessoa.PES_NOME AS "PES_NOME",
          usuario.USU_FOTO AS "USU_FOTO"
      FROM POST, PET, USUARIO, PESSOA
      WHERE
          pet.PET_ID = post.PET_ID   AND
          usuario.USU_ID = post.USU_ID AND
          pessoa.PES_ID = usuario.PES_ID AND
          post.POS_ID = :idPost
    `;

    const options = {
      fetchInfo: {
        PET_FOTO: { type: OracleDB.BUFFER },
        USU_FOTO: { type: OracleDB.BUFFER },
      },
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    };

    const result = await connection.execute(      sql,      { idPost: idPost },      options    );

    if (result.rows.length > 0) {
      const row = result.rows[0]
      
      const postDataToSend = {
          POS_ID: row.POS_ID,
          POS_TIPO: row.POS_TIPO,
          PET_NOME: row.PET_NOME,
          PET_DESCRICAO: row.PET_DESCRICAO,
          PET_LOCAL: row.PET_LOCAL,
          PES_NOME: row.PES_NOME,
          POS_DATA: formatarDataParaDDMMYYYY(
            new Date(row.POS_DATA).toISOString().split("T")[0]
          ),
          PET_FOTO: row.PET_FOTO
        ? `data:image/jpeg;base64,${row.PET_FOTO.toString("base64")}`
        : null,
          USU_FOTO: row.USU_FOTO
        ? `data:image/jpeg;base64,${row.USU_FOTO.toString("base64")}`
        : null,
      };

      return postDataToSend

    } else {
      console.error("Erro ao buscar publicação ELSE:", error);
      throw error;
    } 

  } catch (error) {
    console.error("Erro ao buscar publicação CATCH:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}
export default {
  salvarDenuncia,
  listarUsuariosEDenuncias,
  listarDenuncias
};
