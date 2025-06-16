import log from '../utils/logger.js'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import TokenModel from '../model/TokenModel.js'
import UserModel from '../model/UserModel.js'
import { SECRET_KEY } from "../configs/authConfig.js";
import { myEmail } from "../configs/myEmail.js";
import transporter from "../configs/mailConfig.js";

class TokenService {
    gerarTokenJWT({userId, role, email}){
        log('INFO', 'TOKENSERVICE', 'gerarTokenJWT', 'INICIO')
        const token = jwt.sign(
            {
                id: userId,
                email: email,
                role: role
            },
            SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )
        log('INFO', 'TOKENSERVICE', 'gerarTokenJWT', 'FIM')
        return token;        
    }
    
    async criarTokenSenha(id, email){
        log('INFO', 'TOKENSERVICE', 'criarTokenSenha', 'INICIO')
        try {
            await TokenModel.invalidarTokensAntigos(id)

            const token = crypto.randomBytes(64).toString("hex");
            const now = new Date();
            now.setHours(now.getHours() + 1);
            
            log('INFO', 'TOKENSERVICE', 'criarTokenSenha', 'TOKEN CRIADO')
            await TokenModel.salvarTokenSenha(id, token, now);
            log('INFO', 'TOKENSERVICE', 'criarTokenSenha', 'TOKEN SALVO')
            
            await this.enviarEmailUsuario(email, token);
            log('INFO', 'TOKENSERVICE', 'criarTokenSenha', 'FIM')            
            
        } catch (error) {
            log('ERROR', 'TOKENSERVICE', 'criarTokenSenha', 'ERRO AO CRIAR TOKEN SENHA')
            console.log(error);
            return false;           
        }

    }

    async enviarEmailUsuario(email, token){
        log('INFO', 'TOKENSERVICE', 'enviarEmailUsuario', 'INICIO')
        const emailTeamplate = {
            from: myEmail,
            to: email,
            subject: "Código de Validação para Redefinição de Senha",
            html: `
            <p>Prezado(a) usuário(a),</p>
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Seu código de validação é: <strong>${token}</strong></p>
            <p>Este código expirará em 1 hora.</p>
            <p>Por favor, insira este código no site para prosseguir com a redefinição.</p>
            <p>Se você não solicitou esta redefinição, pode ignorar este email.</p>
            `,
        }
        
        try {
            await transporter.sendMail(emailTeamplate);
            log('INFO', 'TOKENSERVICE', 'enviarEmailUsuario', 'EMAIL ENVIADO')
            log('INFO', 'TOKENSERVICE', 'enviarEmailUsuario', 'FIM')
            return true;
        } catch (error) {
            log('ERROR', 'TOKENSERVICE', 'enviarEmailUsuario', 'ERRO AO ENVIAR O EMAIL')
            console.log(error);
            return false;
        }
    }

    async validarToken({token, email}){
        log('INFO', 'TokenService', 'validarToken', 'INICIO')
        
        if (!email) throw new Error("E-mail inválido");
        if (!token) throw new Error("Insira o token enviado pelo e-mail");
        if (token.length > 255) throw new Error("Token inválido");
        
        try {            
            const id = await UserModel.pegarIdUsuarioPeloEmail(email);
            const dadosToken = await TokenModel.pegarToken(id, token);
            
            if (!dadosToken) return {erro: "Token inválido ou expirado"}
            
            log('INFO', 'TokenService', 'validarToken', 'FIM')
            return dadosToken;
            
        } catch (error) {

            log('ERRO', 'TokenService', 'validarToken', 'ERRO AO VALIDAR TOKEN')
            console.log(error);
            return false;
            
        }
        
    }

}

export default new TokenService();