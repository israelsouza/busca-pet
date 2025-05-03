import OracleDB from "oracledb";
import dotenv from "dotenv";

dotenv.config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_CONNECTION_STRING:", process.env.DB_CONNECTION_STRING);
async function getConnection() {
    try {
        const connection = await OracleDB.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING,
            privilege: OracleDB.SYSDBA
        });
        console.log("Conexão estabelecida com sucesso!");
        return connection; 
    } catch (error) {
        console.error("Erro ao conectar com o banco de dados:", error.message);
    }
}

export default getConnection;
