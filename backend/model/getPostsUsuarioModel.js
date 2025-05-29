import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import getUserId from "./getUserId.js";

async function getPostsDoUsuario(email) {
  let connection;

  try {
    const userId = await getUserId(email); // reuso da função já existente
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
          pet.PET_ID = post.PET_ID
          AND usuario.USU_ID = post.USU_ID
          AND pessoa.PES_ID = usuario.PES_ID
          AND post.USU_ID = :id
    `;

    const options = {
      fetchInfo: {
        PET_FOTO: { type: OracleDB.BUFFER },
        USU_FOTO: { type: OracleDB.BUFFER },
      },
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    };

    const { rows } = await connection.execute(sql, { id: userId }, options);

    return rows.map(row => ({
      ...row,
      PET_FOTO: row.PET_FOTO ? `data:image/jpeg;base64,${row.PET_FOTO.toString("base64")}` : null,
      USU_FOTO: row.USU_FOTO ? `data:image/jpeg;base64,${row.USU_FOTO.toString("base64")}` : null,
      POS_DATA: row.POS_DATA ? new Date(row.POS_DATA).toLocaleDateString("pt-BR") : null,
    }));

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) await connection.close();
  }
}

export default getPostsDoUsuario;
