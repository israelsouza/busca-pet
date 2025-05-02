import jwt from 'jsonwebtoken'

async function extrairEmailDoToken(token) {
  try {
    const decoded = jwt.decode(token); // Decodifica o token
    return decoded.email; // Retorna o e-mail do payload
  } catch (error) {
    console.error("Erro ao decodificar o token: ", error);
    return null;
  }
}

export default extrairEmailDoToken;
