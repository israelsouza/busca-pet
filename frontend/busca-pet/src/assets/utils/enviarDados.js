export default async function enviarDados(dados, URL) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar os dados");
    }

    const resultado = await response.json();
    console.log("Dados enviados com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
}
