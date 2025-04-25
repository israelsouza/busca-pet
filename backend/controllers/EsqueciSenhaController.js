import getUserIdByEmail from "../model/getUserId";

export async function EsqueciSenhaController(req, res) {
    try {
        const { email } = req.body;

        if (!email)
            res.status(401).send({error: "Email inválido"});


        const idUser = getUserIdByEmail(email);

        
        
    } catch (error) {
        console.error(error);
        return res.status(401)
    }
}