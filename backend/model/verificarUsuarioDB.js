import bcrypt from "bcrypt";
import getConnection from "./connectionOracle.js";

export default async function verificarUsuarioDB(dados) {
  let connection;

  try {
    connection = await getConnection();
    console.log("Iniciando a conexão...\n \n");

    const consultaUsuario = `
    SELECT USU_ID, USU_SENHA
    FROM USUARIO
    WHERE LOWER(USU_EMAIL) = :email
  `;
    const resultado = await connection.execute(consultaUsuario, {
      email: dados.email.toLowerCase(), 
    });

    // Verifica se o e-mail existe no banco de dados
    if (resultado.rows.length === 0) {
      throw new Error("O e-mail não está cadastrado.");
    }

    const [USU_ID, senhaHash] = resultado.rows[0];

     // Compara a senha fornecida com o hash armazenado no banco
    const senhaValida = await bcrypt.compare(dados.password, senhaHash);


    if (!senhaValida) {
        throw new Error("Senha inválida");
    }

    console.log("Usuário autenticado com sucesso!");
    console.log("Fechando a conexão...");
    await connection.close();

   return { userId: USU_ID, message: "Usuário autenticado com sucesso." };
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);

    if (connection) {
      await connection.close();
    }

    throw error;
  }
}
