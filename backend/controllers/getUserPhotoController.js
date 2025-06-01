import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";
import getPhotoAndName from "../model/getPhotoAndName.js";

async function getUserPhotoController(req, res) {
  const token = req.params.token;
  try {
    const email = await extrairEmailDoToken(token);
    const userInfo = await getPhotoAndName(email);

    if (userInfo) {
      let imageBuffer = null;

      console.log(
        "Backend - Formato original de userInfo.imagem:",
        userInfo.imagem
      ); // Mantenha este log!

      // userInfo.imagem é um objeto stream-like (um Lob)
      // A condição 'typeof userInfo.imagem.pipe === 'function'' é uma forma comum de identificar Readable Streams
      if (userInfo.imagem && typeof userInfo.imagem.pipe === "function") {
        // É um stream. Precisamos ler todos os chunks e concatená-los em um Buffer.
        imageBuffer = await new Promise((resolve, reject) => {
          const chunks = [];
          userInfo.imagem.on("data", (chunk) => {
            chunks.push(chunk);
          });
          userInfo.imagem.on("end", () => {
            if (chunks.length > 0) {
              resolve(Buffer.concat(chunks)); // Concatena todos os chunks em um único Buffer
            } else {
              resolve(null); // Stream vazio, sem dados de imagem
            }
          });
          userInfo.imagem.on("error", (err) => {
            console.error("Erro ao ler stream da imagem:", err);
            reject(err); // Rejeita a Promise em caso de erro no stream
          });
        });
      } else if (userInfo.imagem instanceof Buffer) {
        // Se já for um Buffer nativo do Node.js (menos provável agora)
        imageBuffer = userInfo.imagem;
      } else if (
        userInfo.imagem &&
        typeof userInfo.imagem === "object" &&
        Array.isArray(userInfo.imagem.data)
      ) {
        imageBuffer = Buffer.from(userInfo.imagem.data);
      }


      let imagemBase64 = null;
      if (imageBuffer) {
        imagemBase64 = imageBuffer.toString("base64");
      }

      console.log(
        "Backend - imagemBase64 gerada para envio:",
        typeof imagemBase64,
        imagemBase64 ? imagemBase64.substring(0, 50) + "..." : null
      );

      return res.status(200).json({ PES_NOME: userInfo.nome, USU_FOTO: imagemBase64 });
    } else {
      return res.status(404).json({ message: "Informações do usuário não encontradas" });
    }
  } catch (err) {
    console.error("ERROR no getUserPhotoController: ", err); // Log o erro completo para depuração
    return res.status(400).json({ message: "Erro ao tentar pegar sua foto, atualize a página" });
  }
}

export default getUserPhotoController;
