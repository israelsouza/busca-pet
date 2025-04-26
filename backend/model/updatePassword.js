import getConnection from "./connectionOracle.js";

async function updatePassword(newPassword, email) {
    let connection;
    try {
        connection = await getConnection();

        const sqlQuery = `
            UPDATE USUARIO
            SET USU_SENHA = :newPassword
            WHERE USU_EMAIL = :email
        `

        const binds = [
            newPassword, email
        ]

        const resultQuery =  await connection.execute(sqlQuery, binds, {autoCommit: true})

        console.log('Update com sucesso!!')
        console.log(resultQuery.rowsAffected)
        
        return resultQuery.rowsAffected > 0 ;
    } catch (error) {
        console.log("ENTREI ERROO  ")
        console.error(error)
        return false; 
    } finally {
        if (connection)
            await connection.close();
    }
}

export default updatePassword;