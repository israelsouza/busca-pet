import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const myEmail = process.env.MAIL_AUT_USER; 

export function templateEmailBanir(email, usuario){
    return {
        from: myEmail,
        to: email,
        subject: "Banimento do site BuscaPet",
        html: `
                <p>Prezado(a) ${usuario},</p>
                <p>Informamos que sua conta foi banida do site BuscaPet devido ao descumprimento de nossas políticas de uso.</p>
                <p>O acesso à sua conta foi bloqueado e você não poderá mais utilizar nossos serviços.</p>
                <p>Atenciosamente,<br>Equipe BuscaPet</p>
            `,
    }
}

export function templateEmailRecuperarSenha(email, token){
    return {
        from: myEmail,
        to: email,
        subject: "Recuperação de Senha - BuscaPet",
        html: `
                <p>Prezado(a) usuário(a),</p>
                <p>Você solicitou a recuperação de senha para sua conta no BuscaPet.</p>
                <p>Para redefinir sua senha, copie o código abaixo:</p>
                <p>Este código expirará em 1 hora.</p>
                <br>
                <p>Código de validação:</p>
                <strong>${token}</strong>
                <br><br>
                <p>Por favor, insira este código no site para prosseguir com a redefinição de senha.</p>
                <p>Se você não solicitou essa alteração, por favor ignore este e-mail.</p>
                <p>Atenciosamente,<br>Equipe BuscaPet</p>
            `,
    }
}
