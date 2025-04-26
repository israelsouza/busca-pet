import getConnection from "./connectionOracle.js";

/**
 * Busca e valida um token de recuperação de senha no banco de dados.
 * @async
 * @param {number} idUser - O id do usuário associado ao token.
 * @param {string} token - O token de recuperação a ser validado.
 * @returns {Promise<object|null>} Um objeto contendo os dados do token (`USU_ID`, `REC_TOKEN`, `REC_DTLIMITE`) se o token for válido e não expirado, caso contrário retorna `null`.
 * @throws {Error} Se ocorrer um erro ao conectar ou consultar o banco de dados.
 */

async function getTokenPassword(idUser, token) {
  let connection;
  try {
    connection = await getConnection();

    const sqlQuery = `
            SELECT REC_TOKEN, REC_DTLIMITE, USU_ID
            FROM RECUPERAR_SENHA
            WHERE   USU_ID = :idUser
            AND     REC_TOKEN = :token
        `;

    const binds = [idUser, token];

    const tokenResult = await connection.execute(sqlQuery, binds);

    if (tokenResult.rows.length === 0) {
      return null; // Token não encontrado para este usuário
    }

    const tokenData = tokenResult.rows[0];
    const expiryDate = new Date(tokenData.REC_DTLIMITE);
    const now = new Date();

    if (now > expiryDate) {
      return null; // Token expirado
    }

    console.log(`
    USU_ID -- ${tokenData[2]} ------------
    REC_TOKEN -- ${tokenData[0]} ------------
    REC_DTLIMITE -- ${tokenData[1]}    
    `)

    return {
      USU_ID: tokenData[2],
      REC_TOKEN: tokenData[0],
      REC_DTLIMITE: tokenData[1],
    }; // Retorna os dados do token se válido

  } catch (error) {
    console.log(error);
  }
}

export default getTokenPassword;