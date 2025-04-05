import OracleDB from "oracledb";
import dbConfig from "../config/dbConfig.js";

async function getConnection() {
  try {
    return await OracleDB.getConnection(dbConfig);
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;

  }
}

export default getConnection;
