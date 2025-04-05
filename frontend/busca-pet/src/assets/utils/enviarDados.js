export default async function enviarDados(dados, URL) {
  try {
    const response = await fetch(URL, {
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
