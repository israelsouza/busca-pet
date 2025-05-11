import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";

async function pegarDadosDoUsuario(email) {
    let connection;
    console.log("B-EDTPERF-MODEL: Pegando dados user - Inicio  ");
    try {
        connection = await getConnection();

        const sqlQuery = `
            SELECT 
             PESSOA.PES_NOME,
             PESSOA.PES_PHONE,
             USUARIO.USU_EMAIL,
             ENDERECO.END_RUA,
             ENDERECO.END_BAIRRO,
             CIDADE.CID_DESCRICAO,
             ESTADO.EST_SIGLA
            FROM
             PESSOA,
             USUARIO,
             ENDERECO,
             CIDADE,
             ESTADO
            WHERE
               ESTADO.EST_ID = CIDADE.EST_ID      AND
               CIDADE.CID_ID = ENDERECO.CID_ID    AND
               ENDERECO.END_ID = PESSOA.END_ID    AND
               PESSOA.PES_ID = USUARIO.PES_ID     AND
               USUARIO.USU_EMAIL = :emailVar
        `
        const binds = {
            emailVar: email
        };

        const { rows } = await connection.execute(sqlQuery, binds, {outFormat: OracleDB.OUT_FORMAT_OBJECT});

        console.log("B-EDTPERF-MODEL: Pegando dados user - Fim  ");

        return rows;
        
    } catch (error) {
        console.error(error)
    } finally {
        if ( connection ) connection.close();
    }
}

export default pegarDadosDoUsuario;
