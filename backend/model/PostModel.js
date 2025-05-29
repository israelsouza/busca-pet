import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";

export async function getPetsNaRegiaoModel(latPesquisa, lonPesquisa, raioKm) {
    let connection;

    try {
        connection = await getConnection();

        const sql = `
            SELECT
                p.POS_ID,
                p.PES_NOME,
                p.PET_TIPO,
                POST.POS_TIPO,
                p.PET_DESCRICAO,
                p.PET_LOCAL,
                p.PET_DATA,
                DISTANCIA_HAVERSINE_KM(
                    :lat_pesquisa,
                    :lon_pesquisa,
                    JSON_VALUE(p.PET_LOCAL, '$.lat'),
                    JSON_VALUE(p.PET_LOCAL, '$.lng')
                ) AS DISTANCIA_KM
            FROM
                PET p, POST, PESSOA, USUARIO
            WHERE
                p.PET_ID = POST.PET_ID          AND
                USUARIO.USU_ID = POST.USU_ID    AND
                PESSOA.PES_ID = USUARIO.PES_ID  AND
                DISTANCIA_HAVERSINE_KM(
                    :lat_pesquisa,
                    :lon_pesquisa,
                    JSON_VALUE(p.PET_LOCAL, '$.lat'),
                    JSON_VALUE(p.PET_LOCAL, '$.lng')
                ) <= :raio_km
        `;

        const binds = {
            lat_pesquisa: latPesquisa,
            lon_pesquisa: lonPesquisa,
            raio_km: raioKm
        };

        const options = {
            outFormat: OracleDB.OUT_FORMAT_OBJECT
        };

        const result = await connection.execute(
            sql, binds, options
        );

        return result.rows;

    } catch (error) {
        console.error("Erro Modal: ", error)
        throw error;               
    } finally {
        if (connection)
            await connection.close();
    }
}

export async function getPostsPorTextoModel(termoBuscado) {
    let connection;

    try {

        connection = await getConnection();

        const sql = `
            SELECT
                post.POS_ID AS "POS_ID",
                post.POS_TIPO AS "POS_TIPO",
                pet.PET_NOME AS "PET_NOME",
                pet.PET_DESCRICAO AS "PET_DESCRICAO",
                pet.PET_FOTO AS "PET_FOTO",
                pet.PET_LOCAL AS "PET_LOCAL",
                pet.PET_DATA AS "POS_DATA",
                pessoa.PES_NOME AS "PES_NOME",
                usuario.USU_FOTO AS "USU_FOTO",
                JSON_VALUE(pet.PET_LOCAL, '$.lat') AS "PET_LOCAL_LAT",
                JSON_VALUE(pet.PET_LOCAL, '$.lng') AS "PET_LOCAL_LNG",
                JSON_VALUE(pet.PET_LOCAL, '$.enderecoTexto') AS "PET_LOCAL_ENDERECO"                
            FROM
                POST, PET, USUARIO, PESSOA
            WHERE
                pet.PET_ID = post.PET_ID          AND
                usuario.USU_ID = post.USU_ID      AND
                pessoa.PES_ID = usuario.PES_ID    AND

                LOWER(JSON_VALUE(pet.PET_LOCAL, '$.enderecoTexto')) LIKE LOWER('%' || :termoBuscado || '%')
        `

        const binds = {termoBuscado:termoBuscado}

        const options = {
            outFormat: OracleDB.OUT_FORMAT_OBJECT
        }

        const result = await connection.execute(
            sql,
            binds,
            options
        );

        return result.rows;
        
    } catch (error) {
        console.error("Erro Modal: ", error)
        throw error;               
    } finally {
        if (connection)
            await connection.close();
    }
}