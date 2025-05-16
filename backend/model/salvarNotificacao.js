import OracleDB from "oracledb";
import getConnection from "./connectionOracle.js";

async function salvarNotificacaoUsuario(data) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
            INSERT INTO NOTIFICACOES (NOT_REMETENTE_ID, NOT_DESTINATARIO_ID, NOT_CONTEUDO)
            VALUES (:remetente, :destinatario, :conteudo)
            RETURNING NOT_ID INTO :notificacaoId
        `;
    const result = await connection.execute(sql, {
      remetente: data.rementente,
      destinatario: data.destinatario,
      conteudo: data.conteudo,
      notificacaoId: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT }
    },{
        autoCommit: true
    });

    console.log(result.outBinds);
    return result.outBinds.notificacaoId[0]
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) connection.close();
  }
}

export default salvarNotificacaoUsuario;
