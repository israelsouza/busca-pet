const getConnection = require("../config/db");

async function atualizarCampo(usuId, campo, valor) {
  const connection = await getConnection();

  const atualizarCampos = ['USU_EMAIL', 'USU_FOTO', 'PES_PHONE', 'END_RUA', 'END_BAIRRO', 'CID_DESCRICAO', 'EST_SIGLA']; 
  if (!atualizarCampos.includes(campo)) {
    throw new Error("Campo inválido.");
  }

  const sql = `UPDATE USUARIO SET ${campo} = :valor WHERE USU_ID = :usuId`;
  await connection.execute(sql, { valor, usuId }, { autoCommit: true });
  await connection.close();
  
  return `${campo} atualizado com sucesso!`;
}

async function buscarPorId(id) {
  const connection = await getConnection();
  try {
    const sql = `
      SELECT 
          U.USU_EMAIL AS EMAIL,
          P.PES_NOME AS NOME,
          P.PES_PHONE AS TELEFONE,
          E.END_RUA AS RUA,
          E.END_BAIRRO AS BAIRRO,
          C.CID_DESCRICAO AS CIDADE,
          S.EST_SIGLA AS ESTADO
      FROM USUARIO U
      JOIN PESSOA P ON U.PES_ID = P.PES_ID
      JOIN ENDERECO E ON P.END_ID = E.END_ID
      JOIN CIDADE C ON E.CID_ID = C.CID_ID
      JOIN ESTADO S ON C.EST_ID = S.EST_ID
      WHERE U.USU_ID = :id`;

    const result = await connection.execute(sql, { id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows[0];
  } finally {
    await connection.close();
  }
}

async function atualizarFoto(usuId, fotoBuffer) {
  const connection = await getConnection();
  try {
    const sql = `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_ID = :usuId`;
    await connection.execute(sql, { foto: fotoBuffer, usuId }, { autoCommit: true });
  } finally {
    await connection.close();
  }
}

export default { atualizarCampo, buscarPorId, atualizarFoto };
