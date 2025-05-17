import getConnection from "./connectionOracle.js";

async function deleteNotificationModel(id) {
    let connection;
    try {
        connection = await getConnection();

        const sql = ` DELETE FROM NOTIFICACOES WHERE NOT_ID = :id`;

        const result = await connection.execute(sql, {id: id}, { autoCommit: true});
        console.log(result)
        return result;
    } catch (e) {
        console.error(e)
        return null;
    } finally {
        if (connection) await connection.close();
    }
}

export default deleteNotificationModel