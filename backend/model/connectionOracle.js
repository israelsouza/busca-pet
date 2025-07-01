import OracleDB from "oracledb";
import dbConfig from "../configs/dbConfig.js";

async function getConnection() {
  try {
    const connection = await OracleDB.getConnection(dbConfig);

    console.log(" ---------------- Conexão estabelecida com Sucesso! ---------------- ");
    return connection;
  } catch (error) {
    console.log(" ---------------- Erro ao estabelecer conexão. ---------------- ", error);
    throw error;
  }
}

export default getConnection;
