import express from "express";
import getUserIdByEmail  from "../model/getUserId.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const dados = req.body;
    console.log(dados)
    console.log("============ Cadastrar PET PERDIDO ================")

    try {
        const email = req.user.email;

        if (!email) {
        return res.status(400).json({ message: "Email do usuário não encontrado no token" });
        }

        const idUser = await getUserIdByEmail(email);

        if (!idUser) {
            return res.status(404).json({ message: "Usuário não encontrado no banco de dados" });
        }

        console.log("ID do usuário:", idUser);


    } catch (error) {
        console.error("Erro ao obter o email do usuário:", error);
    }
    
})

export default router;