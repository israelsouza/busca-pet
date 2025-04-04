import OracleDB from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// informações que vão ficar no .env para só os devs terem acesso ao banco
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

// uma função que vai retornar a conexão com o banco quando for chamada em outro arquivo
async function getConnection() {
  try {
    return await OracleDB.getConnection(dbConfig);
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}

export default getConnection;
