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
            
        await updatePassword(newPassword, email);

        console.log("Sucesso, senha atualizada!!");

        // remover token banco de dados

        const idUser = await getUserIdByEmail(email)
        await removeTokenData(idUser)


    } catch (error) {
        console.log(error)
    }
}

export default atualizarSenhaController;