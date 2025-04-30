class PostModel {
    static async getAllPosts() {
        const query = `
            SELECT 
                p.POS_TIPO,
                pet.PET_NOME,
                pet.PET_DESCRICAO,
                pet.PET_FOTO,
                pet.PET_LOCAL,
                p.POS_DATA,
                pes.PES_NOME,
                u.USU_FOTO
                FROM POST p
                INNER JOIN PET pet ON pet.PET_ID = p.POS_ID
                INNER JOIN PESSOA pes ON pes.PES_ID = p.PES_ID
                INNER JOIN USUARIO u ON u.PES_ID = pes.PES_ID
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getUserPosts(userId) {
        const query = `
    
            pet.PET_NOME,
            pet.PET_DESCRICAO,
            pet.PET_FOTO,
            pet.PET_LOCAL,
            p.POS_DATA,
            pes.PES_NOME,
            u.USU_FOTO 
            FROM POST p
            INNER JOIN PET pet ON pet.PET_ID = p.POS_ID
            INNER JOIN PESSOA pes ON pes.PES_ID = p.PES_ID
            INNER JOIN USUARIO u ON u.PES_ID = pes.PES_ID
            WHERE p.PES_ID = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async getPostsByType(type) {
        const query = `
    SELECT 
        p.POS_TIPO,
        pet.PET_NOME,
        pet.PET_DESCRICAO,
        pet.PET_FOTO,
        pet.PET_LOCAL,
        p.POS_DATA,
        pes.PES_NOME,
        u.USU_FOTO -- Foto do perfil do usuário
        FROM POST p
        INNER JOIN PET pet ON pet.PET_ID = p.POS_ID
        INNER JOIN PESSOA pes ON pes.PES_ID = p.PES_ID
        INNER JOIN USUARIO u ON u.PES_ID = pes.PES_ID
        WHERE p.POS_TIPO = ?
        `;
        const [rows] = await db.execute(query, [type]);
        return rows;
    }
}

export default PostModel;
