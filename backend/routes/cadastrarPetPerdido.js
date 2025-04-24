import express from "express";
import getUserIdByEmail  from "../model/getUserId.js";
import getConnection from "../model/connectionOracle.js";
import inserirPet from "../model/inserirPet.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();



router.post("/", upload.single("imagem"), async (req, res) => {
    const { nome, rga, tipoPet, descricao, data } = req.body;
    const imagem = req.file; // Arquivo enviado
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

        const dados = {
            nome,
            rga,
            tipo: tipoPet,
            descricao,
            data,
            imagem: imagem.path, // Caminho do arquivo salvo
            idUser,
        };        

        console.table(dados)

        const { petId, postId } = await inserirPet(connection, dados);

        console.log("IDs gerados:", { petId, postId });

        console.log("sucesso ao cadastrar o pet")
        await connection.commit(); // Confirma a transação
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