import getConnection from "./connectionOracle.js";

async function getIdFromPost(idPost) {
    let connection;

    try {
        connection = await getConnection();

        const sql = `
            SELECT USU_ID
            FROM   POST
            WHERE  POS_ID = :idPost
        `

        const binds = {
            idPost: idPost
        }

        const result = await connection.execute(sql, binds);

        console.log(result);
        
    } catch (error) {
        console.error(error); 
    } finally {
        if (connection) await connection.close()
    }
}

export default getIdFromPost;