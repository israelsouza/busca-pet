import getUserIdByEmail from "../model/getUserId.js";
import getTokenPassword from '../model/getTokenPassword.js'

async function validarTokenSenhaController(req, res) {

    try {
        
        const {email , token} = req.body;

        if (!token)
            throw new Error("Insira o token enviado pelo e-mail.");

        const idUser = await getUserIdByEmail(email)

        const tokenData = await getTokenPassword(idUser, token);

        console.log(tokenData);

        if (!tokenData) {
            return res.status(400).json({ erro: "Token inválido ou expirado." });
          }
      
        // Se tokenData não for null, significa que o token é válido e não expirou
        return res.status(200).json({ mensagem: "Token válido.", usu_id: tokenData.USU_ID, success: true });
            
    } catch (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro interno ao validar o token." });
    }
    
}

export default validarTokenSenhaController;