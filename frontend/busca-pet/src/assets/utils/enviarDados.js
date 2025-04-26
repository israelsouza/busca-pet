export default async function enviarDados(dados, endpointBackend) {
  try {
    const token = localStorage.getItem("authToken");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Remove o cabeçalho "Content-Type" se os dados forem FormData
    if (!(dados instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`http://localhost:3000/${endpointBackend}`, {
      method: "POST",
      headers,
      body: dados instanceof FormData ? dados : JSON.stringify(dados),
    });

    const resultado = await response.json();

    return resultado
  } catch (error) {
    throw error
  }
}
