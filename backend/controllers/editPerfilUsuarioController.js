    import usuarioModel from "../model/editPerfilUsuario.js";
    import pegarDadosDoUsuario from "../model/pegarTodosOsDadosModel.js";
    import sharp from "sharp";

    async function pegarTodosOsDados(req, res) {
        const { email } = req.params;
        console.log("B-EDTPERF-CONTROLLER-pegarTodosDados: email capturado -> ", email);

        try {
            const userData = await pegarDadosDoUsuario(email);

            console.log("B-EDTPERF-CONTROLLER-pegarTodosDados: dados do usuario capturados.");

        return res.status(200).json({
            message: "Dados cadastrais obtidos com sucesso!",
            userData
        })
    } catch (error) {
        console.log("B-EDTPERF-CONTROLLER-pegarTodosDados: erro encontrado.");
        console.error(error)
    }
}

export async function buscarUsuario(req, res) {
    const { email } = req.params;

    try {
        const usuario = await usuarioModel.buscarPorEmail(email);
            if (!usuario) {
                return res.status(404).send("Usuário não encontrado.");
            }

            return res.status(200).json({
                message: "Dados cadastrais obtidos ccom sucesso!",
                userData
            })
        } catch (error) {
            console.log("B-EDTPERF-CONTROLLER-pegarTodosDados: erro encontrado.");
            console.error(error)
        }
    }



    async function atualizarCampo(req, res) {
        const { email, campo } = req.params;
        const { valor } = req.body;

        console.log("B-EDTPERF-CONTROLLER-atualizarCampo: campo -> ", campo);
        console.log("B-EDTPERF-CONTROLLER-atualizarCampo: valor -> ", valor);
        console.log("B-EDTPERF-CONTROLLER-atualizarCampo: email -> ", email);
        console.log();

        try {
            const mensagem = await usuarioModel.atualizarCampo(email, campo, valor);
            console.log("B-EDTPERF-CONTROLLER-atualizarCampo: campo atualizado");
            res.send(mensagem);
        } catch (err) {
            console.error(err);
            res.status(500).send("B-EDTPERF-CONTROLLER-atualizarCampo: erro ao atualizar campo " + err.message);
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

            const insertImg = await usuarioModel.atualizarFoto(email, imagemOtimizada);
            console.log("Foto atualizada com sucesso!")
            return res.status(200).json({
                message: "Foto de perfil atualizada com sucesso!",
                insertImg
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar foto por email: " + err.message);
        }
    }

    export default {buscarUsuario, atualizarCampo, atualizarFoto, pegarTodosOsDados};
