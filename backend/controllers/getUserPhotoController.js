import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";
import getPhotoAndName from "../model/getPhotoAndName.js";

async function getUserPhotoController(req, res) {
  const token = req.params.token;
  try {
    const email = await extrairEmailDoToken(token);
    const userInfo = await getPhotoAndName(email);

    if (userInfo) {
        const imagemBase64 = userInfo.imagem ? userInfo.imagem.toString('base64') : null;

        return res.status(200).json({ PES_NOME: userInfo.nome, USU_FOTO: imagemBase64 })

    } else {
        return res.status(404).json({ message: "Informações do usuário não encontradas" })
    }



  } catch (err) {
    console.error("ERROR: ", )
    return res.status(400).json({ message: "Erro ao tentar pegar sua foto, atualize a página"});
  }
    
}

export default getUserPhotoController;