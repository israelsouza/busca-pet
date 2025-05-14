import getConnection from "./connectionOracle.js";

async function getPhotoAndName(email) {
  let connection;

  try {
    connection = await getConnection();

    const query = `
            SELECT USUARIO.USU_FOTO, PESSOA.PES_NOME
            FROM USUARIO, PESSOA
            WHERE
              PESSOA.PES_ID = USUARIO.PES_ID AND
              USUARIO.USU_EMAIL = :emaill
        `;

    const binds = {
      emaill: email,
    };

    const result = await connection.execute(query, binds);

    if (result.rows.length > 0) {
      const imagem = result.rows[0][0];
      const name = result.rows[0][1];
      return { imagem: imagem, nome: name };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) await connection.close();
  }
}

export default getPhotoAndName;
