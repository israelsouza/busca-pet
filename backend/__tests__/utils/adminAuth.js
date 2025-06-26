import request from "supertest";
import app from "../../app.js";

/**
 * Realiza o login de um usuário administrador e retorna o token de autenticação.
 * @returns {Promise<string>} O token JWT de administrador.
 */
export const gerarAdminAuthToken = async () => {
  const email = "adm_email@email.com";
  const password = "ALUNOFATEC123";

  const response = await request(app).post("/api/usuario/login").send({
    email: email,
    password: password,
  });

  if (
    response.status !== 200 ||
    !response.body.token ||
    !response.body.token.token
  ) {
    console.error(
      "Falha ao fazer login de ADMIN para obter token. Resposta:",
      response.body
    );
    throw new Error(
      "Não foi possível obter o token de autenticação de ADMIN. Verifique as credenciais do usuário administrador e a rota de login."
    );
  }

  console.log("Token de autenticação ADM obtido com sucesso:");
  console.log(response.body);

  return response.body.token.token;
};
