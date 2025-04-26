    const usuarioModel = require("../models/usuarioModel");

    async function editarCampo(req, res) {
    const { campo } = req.params;
    const { valor } = req.body;
    try {
        const mensagem = await usuarioModel.atualizarCampo(1, campo, valor);
        res.send(mensagem);
    } catch (err) {
        res.status(500).send("Erro ao atualizar: " + err.message);
    }
    }

    async function buscarUsuario(req, res) {
        const id = req.params.id;
        try {
          const usuario = await usuarioModel.buscarPorId(id);
          res.json(usuario);
        } catch (err) {
          res.status(500).send("Erro ao buscar dados: " + err.message);
        }
      }

    async function editarFoto(req, res) {
        const fotoBinario = req.file.buffer;
        try {
        await usuarioModel.atualizarFoto(1, fotoBinario);
        res.send("Foto de perfil atualizada com sucesso!");
        } catch (err) {
        res.status(500).send("Erro ao atualizar foto: " + err.message);
        }
    }  


    module.exports = { editarCampo, buscarUsuario, editarFoto };
