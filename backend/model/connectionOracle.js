import OracleDB from "oracledb";
import dbConfig from "../config/dbConfig.js";

OracleDB.fetchAsBuffer = [OracleDB.BLOB];

async function getConnection() {
  try {
    return await OracleDB.getConnection(dbConfig);
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados: ", error);
    throw error;
  }
}

export default getConnection;
