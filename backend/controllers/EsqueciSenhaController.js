import getUserIdByEmail from "../model/getUserId";
import crypto from 'crypto';
import inserirTokenRecuperacaoSenha from '../model/inserirTokenRecuperarSenha.js'

export async function EsqueciSenhaController(req, res) {
    try {
        const { email } = req.body;

        if (!email)
            res.status(401).send({error: "Email inválido"});


        const idUser = getUserIdByEmail(email);

        const token = crypto.randomBytes(64).toString('hex');

        const now = new Date();
        now.setHours( now.getHours() + 1 );

        inserirTokenRecuperacaoSenha(idUser, token, now);

        
    } catch (error) {
        console.error(error);
        return res.status(401)
    }
}