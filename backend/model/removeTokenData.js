import getConnection from "./connectionOracle";

async function removeTokenData(idUser) {
    let connection;

    try {
        connection = await getConnection()

        const sqlQuery = `
            DELETE FROM RECUPERAR_SENHA
            WHERE USU_ID = :idUser
        `

        const binds = {
            idUser: idUser
        }

        const resultQuery = connection.execute(sqlQuery, binds, {autoCommit: true})

        return resultQuery.rowsAffected > 0;
    } catch (error) {
        console.error(error)
        return false;
    } finally {
        if (connection)
            await connection.close();
    }
}

export default removeTokenData;