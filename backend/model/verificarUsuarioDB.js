import getConnection from "./connectionOracle.js";

export default async function verificarUsuarioDB(dados) {
  let connection;

  try {
    connection = await getConnection();
    console.log("Iniciando a conexão...\n \n");

    const consultaUsuario = `
    SELECT USU_SENHA
    FROM USUARIO
    WHERE LOWER(USU_EMAIL) = :email
  `;
    const resultado = await connection.execute(consultaUsuario, {
      email: dados.email,
    });

    // Verifica se o e-mail existe no banco de dados
    if (resultado.rows.length === 0) {
      throw new Error("O e-mail não está cadastrado.");
    }

    // Captura a senha do banco de dados
    const senhaBanco = resultado.rows[0][0];

    // Compara a senha fornecida com a senha do banco
    if (senhaBanco !== dados.password) {
      throw new Error("A senha está incorreta.");
    }

    console.log("Fechando a conexão...");
    await connection.close();

    return { message: "Usuário encontrado." };
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    throw error;
  }
}
