const db = require('../configs/db');

class InfoPerfilUsuarioModel {
    static async getUserAndPersonInfo(userId) {
        const query = `
            SELECT 
                u.USU_EMAIL, 
                p.PES_NOME
            FROM USUARIO u
            INNER JOIN PESSOA p ON u.PES_ID = p.PES_ID
            WHERE u.USU_ID = :userId
        `;

        try {
            const result = await db.execute(query, [userId], { outFormat: db.OBJECT });
            return result.rows[0] || null;
        } catch (error) {
            console.error('Erro no model ao buscar usuário:', error);
            throw error;
        }
    }
}

module.exports = InfoPerfilUsuarioModel;
