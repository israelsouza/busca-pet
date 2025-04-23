export default async function enviarDados(dados, endpointBackend) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`http://localhost:3000/${endpointBackend}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    const resultado = await response.json();

    return resultado
  } catch (error) {
    throw error
  }
}
