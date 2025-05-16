import getConnection from "./connectionOracle.js";

async function getPhoneFromId(id) {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
            SELECT PES_PHONE
            FROM   PESSOA
            WHERE  PES_ID = :id
        `;

    const binds = {
      id: id,
    };

    const result = await connection.execute(sql, binds);

    return Number(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) await connection.close();
  }
}

export default getPhoneFromId;
