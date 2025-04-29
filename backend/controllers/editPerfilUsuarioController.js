const usuarioModel = require("../model/editPerfilUsuario");

async function editarCampo(req, res) {
    const { campo } = req.params;
    const { valor } = req.body;
    const { usuId } = req.params;

    try {
        const mensagem = await usuarioModel.atualizarCampo(usuId, campo, valor);
        res.send(mensagem);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar: " + err.message);
    }
}

async function buscarUsuario(req, res) {
    const { id } = req.params;

    try {
        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado.");
        }
        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar dados: " + err.message);
    }
}

async function editarFoto(req, res) {
    const { usuId } = req.params;
    const fotoBinario = req.file ? req.file.buffer : null; // Verificando se a foto foi enviada

    if (!fotoBinario) {
        return res.status(400).send("Nenhuma foto foi enviada.");
    }

    try {
        await usuarioModel.atualizarFoto(usuId, fotoBinario);
        res.send("Foto de perfil atualizada com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar foto: " + err.message);
    }
}

export default { editarCampo, buscarUsuario, editarFoto };
