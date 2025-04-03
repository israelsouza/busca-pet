import OracleDB from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// informações que vão ficar no .env para só os devs terem acesso ao banco
const dbConfig = {
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  connectString: dotenv.DB_STRING_CONNECT,
};

// uma função que vai retornar a conexão com o banco quando for chamada em outro arquivo
async function getConnection() {
  try {
    return await OracleDB.getConnection(dbConfig);
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  }
}

export default getConnection;
