import OracleDB from "oracledb";

async function setPetEncontrado(dadosPet, connection) {

    const querySql = `
        INSERT INTO PET (PET_TIPO, PET_DESCRICAO, PET_DATA, PET_FOTO, PET_LOCAL)
        VALUES (:tipo, :descricao, TO_DATE(:data, 'DD-MM-YYYY'), :imagem, :local)
        RETURNING PET_ID INTO :id
    `
    const result = await connection.execute(
        querySql,
        {
            tipo: dadosPet.tipo,
            descricao: dadosPet.descricao,
            data: dadosPet.data,
            imagem: dadosPet.imagem,
            local: dadosPet.local,
            id: { dir: OracleDB.BIND_OUT }, // Retorna o ID gerado
        }
    )

    return result.outBinds.id[0];
}

export default setPetEncontrado;