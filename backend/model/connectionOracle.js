import OracleDB from "oracledb";
import dotenv from "dotenv";

dotenv.config();

const dbconfig = {

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    privilege: OracleDB.SYSDBA, 
};
async function getConnection() {
    try {
        const connection = await OracleDB.getConnection(dbconfig);

        console.log("Conexão estabelecida com Sucesso!");
        return connection;
    } catch (error) {
        console.log("Erro ao estabelecer conexão.", error);
        throw error;
    } 
}


export default getConnection;