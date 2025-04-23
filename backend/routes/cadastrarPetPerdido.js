import express from "express";
import getUserIdByEmail  from "../model/getUserId.js";
import getConnection from "../model/connectionOracle.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const dados = req.body;
    console.log("============ Cadastrar PET PERDIDO ================")

    let connection;

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

        connection = await getConnection();
        console.log("Iniciando transação de Cadastro")


    } catch (error) {
        if (connection) {
        await connection.rollback();
        console.log("Rollback realizado com sucesso.");
        }
    } finally {
        if (connection) await connection.close()
        console.log("Conexão com o banco de dados encerrada.");
    }
    
})

export default router;