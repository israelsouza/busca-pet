import usuarioModel from "../model/editPerfilUsuario.js";
import pegarDadosDoUsuario from "../model/pegarTodosOsDadosModel.js";
import sharp from "sharp";

async function pegarTodosOsDados(req, res) {
    const { email } = req.params;
    //res.status(200).json({ message: `Usuário com e-mail ${email} encontrado.` });

    try {
        const userData = await pegarDadosDoUsuario(email);

        return res.status(200).json({
            message: "Dados cadastrais obtidos ccom sucesso!",
            userData
        })
    } catch (error) {
        console.error(error)
    }
}

async function buscarUsuario(req, res) {
    const { email } = req.params;

    try {
        const usuario = await usuarioModel.buscarPorEmail(email);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado.");
        }
        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar dados por email: " + err.message);
    }
}

async function atualizarCampo(req, res) {
    const { email, campo } = req.params;
    const { valor } = req.body;

    try {
        const mensagem = await usuarioModel.atualizarCampo(email, campo, valor);
        res.send(mensagem);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar campo por email: " + err.message);
    }
}

async function atualizarFoto(req, res) {
    const { email } = req.params;
    const fotoBinario = req.file ? req.file.buffer : null;

    if (!fotoBinario) {
        return res.status(400).send("Nenhuma foto foi enviada.");
    }

    try {
        const imagemOtimizada = await sharp(fotoBinario)
            .resize(500) //largura 500px
            .jpeg({ quality: 80 }) // Converte para JPEG com qualidade reduzida
            .toBuffer();

        await usuarioModel.atualizarFoto(email, imagemOtimizada);
        res.send("Foto de perfil atualizada com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar foto por email: " + err.message);
    }
}

export default {buscarUsuario, atualizarCampo, atualizarFoto, pegarTodosOsDados};
