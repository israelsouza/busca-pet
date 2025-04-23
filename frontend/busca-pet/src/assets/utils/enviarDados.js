export default async function enviarDados(dados, endpointBackend) {
  try {
    const response = await fetch(`http://localhost:3000/${endpointBackend}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await response.json();

    return resultado
  } catch (error) {
    throw error
  }
}
