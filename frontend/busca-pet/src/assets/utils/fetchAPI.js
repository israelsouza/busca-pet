const URL_BASE = `http://localhost:3000/`;

async function fetchAPI(
  endpoint,
  method = "GET",
  data = null,
  addContentTypeJson = false,
  requireAuth = true
) {
  const url = `${URL_BASE}${endpoint}`;
  const token = localStorage.getItem("authToken");

  const headers = {};

  if (requireAuth) {
    if (!token) {
      console.error(
        "Erro: Token de autenticação não encontrado. Redirecionando para o login..."
      );
      throw new Error(
        "Token de autenticação não encontrado. Por favor, faça login novamente."
      );
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (addContentTypeJson) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (data !== null && method !== "GET" && method !== "HEAD") {
    options.body = addContentTypeJson ? JSON.stringify(data) : data; // Stringify se Content-Type é JSON
  }

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("Erro de rede ou fetch interrompido:", error);
    throw error;
  }
}

export default fetchAPI;
