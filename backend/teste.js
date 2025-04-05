import getConnection  from "../backend/model/connectionOracle.js";

async function testando() {
    let connection;
    try {
      connection = await getConnection();
      console.log("Conexão com o banco de dados Oracle estabelecida com sucesso!");
  
      // Opcional: Execute uma consulta simples para verificar a comunicação
      const result = await connection.execute(
        `SELECT 1 FROM DUAL` // Consulta padrão do Oracle para verificar a conexão
      );
      console.log("Consulta de teste executada com sucesso:", result.rows);
  
    } catch (error) {
      console.error("Erro ao conectar ou testar o banco de dados:", error);
    } finally {
      if (connection) {
        try {
          await connection.release();
          console.log("Conexão liberada.");
        } catch (error) {
          console.error("Erro ao liberar a conexão:", error);
        }
      }
    }
  }
  
  testando();