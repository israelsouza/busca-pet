import OracleDB from "oracledb";

async function createPost(petId, connection, idUser) {

    const querySql = `
        INSERT INTO POST (POS_TIPO, POS_DATA, PET_ID, USU_ID)
        VALUES (:tipo, SYSDATE, :idPet, :idUsuario)
        RETURNING POS_ID INTO :id
    `
    const result = await connection.execute(
        querySql,
        {
            tipo: "Encontrado",
            idPet: petId,
            idUsuario: idUser,
            id: { dir: OracleDB.BIND_OUT }, // Retorna o ID gerado
        }
    )

    return result.outBinds.id[0];
}

export default createPost;