const InfoPerfilUsuarioModel = require('../model/InfoPerfilUsuarioModel');

const InfoPerfilUsuarioController = {
    async fetchUserInfo(req, res) {
        try {
            const userId = req.params.userId;
            const userInfo = await InfoPerfilUsuarioModel.getUserAndPersonInfo(userId);
            if (!userInfo) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            res.json(userInfo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = InfoPerfilUsuarioController;
