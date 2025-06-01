import { getUserIdByEmail } from "../model/getUserId.js";
import crypto from "crypto";
import transporter from "../configs/mailConfig.js";
import inserirTokenRecuperacaoSenha from "../model/inserirTokenRecuperarSenha.js";
import invalidarTokensAntigos from "../model/invalidarTokensAntigos.js";
import { myEmail } from "../configs/myEmail.js";

export async function EsqueciSenhaController(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(401).send({ error: "Email inválido" });

    const idUser = await getUserIdByEmail(email);
    console.log('id usuario', idUser);
    if (!idUser)
        return res.status(401).send({ error: "Usuário não encontrado, reveja o email e tente novamente." });

    await invalidarTokensAntigos(idUser);

    const token = crypto.randomBytes(64).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await inserirTokenRecuperacaoSenha(idUser, token, now);

    const mailOptions = {
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
    };

    await transporter.sendMail(mailOptions);
    console.log("Email enviado!!");
    return res.status(200).send({message: "Email enviado! Verifique a sua caixa de spam, se necessário", success: true})
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde." });
  }
}