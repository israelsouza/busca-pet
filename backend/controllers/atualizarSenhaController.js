import getUserIdByEmail from "../model/getUserId";

async function atualizarSenhaController(req, res) {
    try {
        const { password, email } = req.body;

        if (!password)
            throw new Error("Por favor, digite a senha.");

        // criptografando a senha

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const newPassword = await bcrypt.hash(password, salt);
            
        const senhaAtualizada = await updatePassword(newPassword, email);

        if(!senhaAtualizada)
            res.status(400).send({message: "Não foi possível atualizar a senha."})

        console.log("Sucesso, senha atualizada!!");

        // remover token banco de dados

        const idUser = await getUserIdByEmail(email)
        const remocaoTokenBanco = await removeTokenData(idUser)

        if(!remocaoTokenBanco)
            res.status(400).send({ message: "Não foi possível remover o token do banco de dados." });

        return res.status(200).send({ message: "Sucesso, senha atualizada. Realize o login." });

    } catch (error) {
        console.log(error)
        return res.status(400).send({message: "Erro ao tentar atualizar a senha. Tente novamente"})
    }
}

export default atualizarSenhaController;