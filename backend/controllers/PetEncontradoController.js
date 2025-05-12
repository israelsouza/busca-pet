import getUserIdByEmail from "../model/getUserId.js";
import fs from "fs";
import getConnection from "../model/connectionOracle.js";
import setPetEncontrado from "../model/PetEncontradoModel.js";
import createPost from "../model/PostEncontradoModel.js";

function formatarDataParaDDMMYYYY(data) {
    const [ano, mes, dia] = data.split("-"); // Supondo que a data recebida seja no formato YYYY-MM-DD
    return `${dia}-${mes}-${ano}`;
  }

async function PetEncontradoController(req, res) {

    const {data, descricao, tipoPet, email} = req.body;
    const img = req.file

    if (!img || !data || !descricao || !tipoPet) {
        console.log("Todos os campos são obrigatórios")
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const newData = formatarDataParaDDMMYYYY(data)

    let connection;

    try {
        const idUser = await getUserIdByEmail(email);

        if (!idUser)
            return res.status(404).json({ message: "Usuário não encontrado no banco de dados" });

        const imagemBinaria = fs.readFileSync(img.path); 
        // console.log("Tamanho da imagem:", imagemBinaria);

        const dados = {
            tipo: tipoPet,
            descricao,
            data: newData,
            imagem: imagemBinaria, 
            idUser,
        };  

        connection = await getConnection();
        console.log("Iniciando transação de Cadastro")

        const petId = await setPetEncontrado(dados, connection);

        fs.unlinkSync(img.path);
        console.log("Arquivo de imagem deletado com sucesso!");

        const postId = await createPost(petId, connection, idUser);

        console.log("Id do post: ")
        console.log(postId);

        await connection.commit()

        return res.status(201).json({
            message: "Pet cadastrado com sucesso!",
            petId,
            postId,
        });
    } catch (error) {
        console.error("Erro: ", error)

        if (connection) {
            await connection.rollback();
            console.log("Rollback realizado com sucesso.");
        }

        return res.status(500).json({
            message: "Erro ao cadastrar o pet.",
            error: error.message,
        });
    } finally {
        if (connection) await connection.close()
    }
}

export default PetEncontradoController;