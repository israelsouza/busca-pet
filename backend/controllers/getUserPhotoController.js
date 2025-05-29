import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";
import getPhotoAndName from "../model/getPhotoAndName.js";

async function getUserPhotoController(req, res) {
  const token = req.params.token;
  try {
    const email = await extrairEmailDoToken(token);
    const userInfo = await getPhotoAndName(email);

    if (userInfo && userInfo.imagem) {
      let chunks = [];
      userInfo.imagem.on('data', (chunk) => {
        chunks.push(chunk);
      });
      userInfo.imagem.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const imagemBase64 = buffer.toString('base64');
        res.status(200).json({ PES_NOME: userInfo.nome, USU_FOTO: imagemBase64 });
        if (userInfo.connection) await userInfo.connection.close();
      });
      userInfo.imagem.on('error', async (err) => {
        res.status(500).json({ message: "Erro ao ler imagem do banco." });
        if (userInfo.connection) await userInfo.connection.close();
      });
      
    } else {
      res.status(404).json({ message: "Informações do usuário não encontradas" });
      if (userInfo.connection) await userInfo.connection.close();
    }

  } catch (err) {
    console.error("ERROR: ", )
    return res.status(400).json({ message: "Erro ao tentar pegar sua foto, atualize a página"});
  }
    
}
  
export default getUserPhotoController;