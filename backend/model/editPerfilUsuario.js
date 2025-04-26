const getConnection = require("../config/db");

async function atualizarCampo(usuId, campo, valor) {
  const conn = await getConnection();
  const sql = `UPDATE USUARIO SET ${campo} = :valor WHERE USU_ID = :usuId`;
  await conn.execute(sql, { valor, usuId }, { autoCommit: true });
  return `${campo} atualizado com sucesso!`;
}

async function buscarPorId(id) {
    const conn = await getConnection();
    const result = await conn.execute(
      `
      SELECT U.USU_EMAIL, P.PES_NOME, P.PES_PHONE,
             E.END_RUA, E.END_BAIRRO,
             C.CID_DESCRICAO, S.EST_SIGLA
      FROM USUARIO U
      JOIN PESSOA P ON U.PES_ID = P.PES_ID
      JOIN ENDERECO E ON P.END_ID = E.END_ID
      JOIN CIDADE C ON E.CID_ID = C.CID_ID
      JOIN ESTADO S ON C.EST_ID = S.EST_ID
      WHERE U.USU_ID = :id
      `,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  }
async function atualizarFoto(usuId, fotoBuffer) {
    const conn = await getConnection();
    const sql = `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_ID = :usuId`;
    await conn.execute(sql, { foto: fotoBuffer, usuId }, { autoCommit: true });
  }
  

module.exports = { atualizarCampo, buscarPorId, atualizarFoto };
