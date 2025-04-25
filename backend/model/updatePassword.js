import getConnection from "./connectionOracle";

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

        const resultQuery =  connection.execute(sqlQuery, binds, {autoCommit: true})

        console.log('Update com sucesso!!')
        
    } catch (error) {
        console.error(error)
        return false; 
    } finally {
        if (connection)
            await connection.close()
    }
}

export default updatePassword;