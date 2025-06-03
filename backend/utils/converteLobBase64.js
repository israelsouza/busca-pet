export default async function readLobAsBase64(lob) {
    if (!lob) {
        return null; // Retorna null se não houver LOB
    }
    try {
        const buffer = await lob.getData();
        return buffer ? buffer.toString('base64') : null;
    } catch (error) {
        console.error("Erro ao ler LOB e converter para Base64:", error);
        return null; // Retorne null ou trate o erro como preferir
    }
}