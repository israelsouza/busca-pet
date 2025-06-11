import getConnection from "./connectionOracle.js";

async function getNotificationModel(id) {
  console.log("ID NA MODEL DE GET NOT", id);
  
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
          SELECT PES_NOME, NOT_REMETENTE_ID, NOT_DATA_CRIACAO, NOT_CONTEUDO, NOT_ID
          FROM NOTIFICACOES, PESSOA, USUARIO
          WHERE 
            PESSOA.PES_ID = USUARIO.USU_ID AND
            USUARIO.USU_ID = NOT_REMETENTE_ID AND
            NOT_DESTINATARIO_ID = :id            
    `,
      {
        id: id,
      }
    );

    console.log(result.rows);
    
    return result.rows;


  } catch (error) {
    console.error(error);
    throw new Error("Erro na conexão com o banco de dados, tente novamente.");
  } finally {
    if (connection) await connection.close();
  }
}

export default getNotificationModel;
