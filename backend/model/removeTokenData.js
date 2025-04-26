import getConnection from "./connectionOracle.js";

async function removeTokenData(idUser) {
    let connection;

    console.log("id user: ", idUser)

    try {
        connection = await getConnection();

        const sqlQuery = `
            DELETE  FROM RECUPERAR_SENHA
            WHERE USU_ID = :idUser
        `

        const binds = {
            idUser: idUser
        }

        const resultQuery = await connection.execute(sqlQuery, binds, {autoCommit: true})

        return resultQuery.rowsAffected > 0;
    } catch (error) {
        console.error(error)
        console.log('entrei no error')
    } finally {
        if (connection)
            await connection.close();
    }
}

export default removeTokenData;