import getConnection from "./connectionOracle.js";

export async function getUserIdByEmail(email) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = :email`,
      { email }
    );
    
    return result.rows.length > 0 ? result.rows[0][0] : null;
  } catch (error) {
    console.error("Erro ao buscar usuarioId pelo email:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}