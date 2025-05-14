import getConnection from "./connectionOracle.js";


async function atualizarCampo(email, campo, valor) {
  let connection;
  try {
    console.log("B-EDTPERF-MODEL-atualizarCampo: iniciando atualização");
    connection = await getConnection();
    let sql;
    const binds = { valor, email };

    if (campo === "PES_NOME") {
      sql = `UPDATE PESSOA SET PES_NOME = :valor WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)`;
    } else if (campo === "PES_PHONE") {
      sql = `UPDATE PESSOA SET PES_PHONE = :valor WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)`;
    } else if (campo === "USU_EMAIL") {
      sql = `UPDATE USUARIO SET USU_EMAIL = :valor WHERE USU_EMAIL = :email`;
    } else if (campo === "") {
      // foto
    } else if (campo === "END_RUA") {
      sql = `UPDATE ENDERECO SET END_RUA = :valor WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email))`;
    } else if (campo === "END_BAIRRO") {
      sql = `UPDATE ENDERECO SET END_BAIRRO = :valor WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email))`;
    } else if (campo === "CID_DESCRICAO") {
      sql = `UPDATE CIDADE SET CID_DESCRICAO = :valor WHERE CID_ID = (SELECT CID_ID FROM ENDERECO WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)))`;
    } else if (campo === "EST_SIGLA") {
      sql = `UPDATE ESTADO SET EST_SIGLA = :valor WHERE EST_ID = (SELECT EST_ID FROM ENDERECO WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_EMAIL = :email)))`;
    }

    const result = connection.execute(sql, binds);

    await connection.commit();

    console.log("B-EDTPERF-MODEL-atualizarCampo: atualização concluida");

    return `Campo: ${campo} atualizado com sucesso!`;
  } catch (error) {
    console.log("B-EDTPERF-MODEL-atualizarCampo: erro na atualização");
    // Em caso de erro, desfaz a transação
    await connection.rollback();
    throw new Error(`Erro ao atualizar ${campo}: ${error.message}`);
  } finally {
    connection.close();
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
  let connection;

  try {
    connection = await getConnection();

    const sql = `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_EMAIL = :email`;

    const result = await connection.execute(sql, { foto: fotoBuffer, email }, { autoCommit: true });
    console.log(result);
    console.log(result.rows[0])

  } catch (error) {
    console.error(error)
  } finally {
    if (connection) await connection.close();
  }



}

export default { atualizarCampo, buscarPorEmail, atualizarFoto };
