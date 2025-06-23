import jwt from 'jsonwebtoken'

async function extrairIdDoToken(token) {
  try {
    const decoded = {
      id: jwt.decode(token).id,
      role: jwt.decode(token).role
    }

    return decoded
  } catch (error) {
    console.error("Erro ao decodificar o token: ", error);
    return null;
  }
}

export default extrairIdDoToken;
