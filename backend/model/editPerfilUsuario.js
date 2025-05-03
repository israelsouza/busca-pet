const getConnection = require("../config/db");

async function atualizarCampo(email, campo, valor) {
  const conn = await getConnection();
  try {
    // Inicia uma transação
    await conn.beginTransaction();

    // Atualiza PESSOA
    await conn.execute(
      `UPDATE PESSOA SET ${campo} = :valor WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)`,
      { valor, email }
    );

    // Atualiza USUARIO
    await conn.execute(
      `UPDATE USUARIO SET ${campo} = :valor WHERE USU_EMAIL = :email`,
      { valor, email }
    );

    // Atualiza ENDERECO
    await conn.execute(
      `UPDATE ENDERECO SET ${campo} = :valor WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email))`,
      { valor, email }
    );

    // Atualiza CIDADE
    await conn.execute(
      `UPDATE CIDADE SET ${campo} = :valor WHERE CID_ID = (SELECT CID_ID FROM ENDERECO WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)))`,
      { valor, email }
    );

    // Confirma a transação
    await conn.commit();

    return `${campo} atualizado com sucesso!`;

  } catch (error) {
    // Em caso de erro, desfaz a transação
    await conn.rollback();
    throw new Error(`Erro ao atualizar ${campo}: ${error.message}`);
  } finally {
    conn.close();
  }
}

async function buscarPorEmail(email) {
  const conn = await getConnection();
  const result = await conn.execute(
    `
    SELECT
        pessoa.PES_NOME,
        pessoa.PES_PHONE, 
        usuario.USU_EMAIL,
        endereco.END_RUA,
        endereco.END_BAIRRO,
        cidade.CID_DESCRICAO,
        estado.EST_SIGLA
    FROM PESSOA
    JOIN USUARIO ON pessoa.PES_ID = usuario.PES_ID
    JOIN ENDERECO ON endereco.END_ID = pessoa.END_ID
    JOIN CIDADE ON cidade.CID_ID = endereco.CID_ID
    JOIN ESTADO ON estado.EST_ID = cidade.EST_ID
    WHERE usuario.USU_EMAIL = :email
    `,
    { email, outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  return result.rows[0];
}

async function atualizarFoto(email, fotoBuffer) {
  const conn = await getConnection();
  const sql = `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_EMAIL = :email`;
  await conn.execute(sql, { foto: fotoBuffer, email }, { autoCommit: true });
}

export default { atualizarCampo, buscarPorEmail, atualizarFoto };
