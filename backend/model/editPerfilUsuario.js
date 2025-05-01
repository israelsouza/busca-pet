const getConnection = require("../config/db");

async function atualizarCampo(usuId, campo, valor) {
  const conn = await getConnection();
  //TESTAR QUERYS DE UPDATE
  try {
      // Inicia uma transação
      await conn.beginTransaction();

      // Atualiza PESSOA
      await conn.execute(
          `UPDATE PESSOA SET ${campo} = :valor WHERE PES_ID = :pesId`,
          { valor, pesId: usuId }
      );

      // Atualiza USUARIO
      await conn.execute(
          `UPDATE USUARIO SET ${campo} = :valor WHERE USU_ID = :usuId`,
          { valor, usuId }
      );

      // Atualiza ENDERECO
      await conn.execute(
          `UPDATE ENDERECO SET ${campo} = :valor WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = :pesId)`,
          { valor, pesId: usuId }
      );

      // Atualiza CIDADE
      await conn.execute(
          `UPDATE CIDADE SET ${campo} = :valor WHERE CID_ID = (SELECT CID_ID FROM ENDERECO WHERE END_ID = (SELECT END_ID FROM PESSOA WHERE PES_ID = :pesId))`,
          { valor, pesId: usuId }
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


async function buscarPorId(id) {  //NOME BUSCA ID, MAS NÃO HÁ BUSCA POR ID, COLOCAR A FUNCTION DE USUÁRIO PARA PUXAR AO CARREGAR A PÁGINA
    const conn = await getConnection();
    const result = await conn.execute(
      //QUERY DE SELECT PELO ID (PARA PUXAR OS DADOS DO USUÁRIO): OQUE EU PRECISO(PES_NOME, PES_PHONE, USU_EMAIL, END_RUA, END_BAIRRO, CID_DESCRICAO, EST_SIGLA)
      //TESTAR ESTÁ QUERY
      `
	    SELECT
            pessoa.PES_NOME,
            pessoa.PES_PHONE, 
            usuario.USU_EMAIL,
            endereco.END_RUA,
            endereco.END_BAIRRO,
            cidade.CID_DESCRICAO,
            estado.EST_SIGLA
      FROM PESSOA, USUARIO, ENDERECO, CIDADE, ESTADO
      WHERE pessoa.PES_ID = usuario.PES_ID AND
      endereco.END_ID = pessoa.END_ID AND
      cidade.CID_ID = endereco.CID_ID AND
      estado.EST_ID = cidade.EST_ID;
      `,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  }
async function atualizarFoto(usuId, fotoBuffer) {
    const conn = await getConnection();
    const sql = `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_ID = :usuId`;
    await conn.execute(sql, { foto: fotoBuffer, usuId }, { autoCommit: true });
  }

export default { atualizarCampo, buscarPorId, atualizarFoto };
