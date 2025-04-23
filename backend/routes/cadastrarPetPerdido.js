import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    const dados = req.body;
    console.log(dados)
    console.log("============ Cadastrar PET PERDIDO ================")

    try {
        const email = req.user.email;

        console.log(email)

        if (!email) {
        return res.status(400).json({ message: "Email do usuário não encontrado no token" });
        }

        console.log("Email do usuário:", email);
    } catch (error) {
        console.error("Erro ao obter o email do usuário:", error);
    }
    
})

export default router;