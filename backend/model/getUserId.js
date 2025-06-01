import getConnection from "./connectionOracle.js";

export async function getUserIdByEmail(email) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = :email`,
      { email }
    );

    // Retorna o ID do usuário, se encontrado
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

export async function getUsersEDenuncias() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(`
                SELECT
                    U.USU_ID AS id,
                    P.PES_NOME AS nome,
                    U.USU_EMAIL AS email,
                    COUNT(D.DEN_ID) AS denuncias_count
                FROM
                    USUARIO U
                INNER JOIN
                    PESSOA P ON U.PES_ID = P.PES_ID
                LEFT JOIN
                    DENUNCIAS D ON U.USU_ID = D.USU_ID
                GROUP BY
                    U.USU_ID, P.PES_NOME, U.USU_EMAIL
                ORDER BY
                    P.PES_NOME
            `);
    return result.rows.map((row) => {
      return {
        id: row.ID,
        nome: row.NOME,
        email: row.EMAIL,
        denuncias_count: row.DENUNCIAS_COUNT,
      };
    });
  } catch (error) {
    console.error("Erro no modelo ao buscar usuários com denúncias:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
