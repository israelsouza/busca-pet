export async function validateToken() {
  const token = localStorage.getItem("authToken");

  if (!token) {    
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  // fazendo a requisição
  const response = await fetch("http://localhost:3000/validate-token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // envia o token no cabeçalho
    },
  });

  // validações de possuiveis retornos do backend
  if (response.status === 401) {
    const data = await response.json();

    if (data.message === "Token expirado") {        
      throw new Error("Token expirado. Faça login novamente");
    }    
    throw new Error("Token inválido");
  }

  if (!response.ok) {
    throw new Error("Erro ao validar o token");
  }

  return true;
}
