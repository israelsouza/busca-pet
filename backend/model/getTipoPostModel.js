import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb"; // Certifique-se de importar OracleDB aqui

async function getTipoPostModel(tipo) {
  let connection;

  try {
    console.log("estou na função");
    connection = await getConnection();

    const sql = `
            SELECT
                post.POS_TIPO AS "POS_TIPO",
                pet.PET_NOME AS "PET_NOME",
                pet.PET_DESCRICAO AS "PET_DESCRICAO",
                pet.PET_FOTO AS "PET_FOTO",
                pet.PET_LOCAL AS "PET_LOCAL",
                post.POS_DATA AS "POS_DATA",
                pessoa.PES_NOME AS "PES_NOME",
                usuario.USU_FOTO AS "USU_FOTO"
            FROM POST, PET, USUARIO, PESSOA
            WHERE
                pet.PET_ID = post.PET_ID   AND
                usuario.USU_ID = post.USU_ID AND
                pessoa.PES_ID = usuario.PES_ID  AND
                post.POS_TIPO = :tipo
        `;

    const binds = {
      tipo: tipo, // Bind the tipo parameter to the SQL query
    };

    const options = {
      fetchInfo: {
        PET_FOTO: { type: OracleDB.BUFFER },
        USU_FOTO: { type: OracleDB.BUFFER },
      },
    };

    const { rows } = await connection.execute(sql, binds, options);
    console.log(rows);

    return rows;
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) await connection.close();
  }
}

export default getTipoPostModel;
