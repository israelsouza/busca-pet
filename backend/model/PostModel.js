import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";

export async function getPetsNaRegiaoModel(latPesquisa, lonPesquisa, raioKm) {
    let connection;

    try {
        connection = await getConnection();

        const sql = `
WITH PETS_COORDS AS (
    SELECT
        pet.*,
        JSON_VALUE(pet.PET_LOCAL, '$.lat' RETURNING NUMBER) AS LAT_NUMERIC,
        JSON_VALUE(pet.PET_LOCAL, '$.lng' RETURNING NUMBER) AS LNG_NUMERIC
    FROM PET pet
)
SELECT
    post.POS_ID AS "POS_ID",
    pessoa.PES_NOME AS "PES_NOME",
    pet.PET_TIPO AS "PET_TIPO",
    post.POS_TIPO AS "POS_TIPO",
    pet.PET_DESCRICAO AS "PET_DESCRICAO",
    pet.PET_LOCAL AS "PET_LOCAL",
    pet.PET_DATA AS "PET_DATA",
    DISTANCIA_HAVERSINE_KM(
        :lat_pesquisa,
        :lon_pesquisa,
        pet.LAT_NUMERIC,
        pet.LNG_NUMERIC
    ) AS DISTANCIA_KM
FROM
    PETS_COORDS pet
    JOIN POST post ON pet.PET_ID = POST.PET_ID
    JOIN USUARIO usuario ON usuario.USU_ID = POST.USU_ID
    JOIN PESSOA pessoa ON pessoa.PES_ID = usuario.PES_ID
WHERE
    DISTANCIA_HAVERSINE_KM(
        :lat_pesquisa,
        :lon_pesquisa,
        pet.LAT_NUMERIC,
        pet.LNG_NUMERIC
    ) <= :raio_km
        `


        const binds = {
            lat_pesquisa: latPesquisa,
            lon_pesquisa: lonPesquisa,
            raio_km: raioKm
        };

        console.log(binds.lat_pesquisa)
        console.log(binds.lon_pesquisa)
        console.log(raioKm)

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
                pet.PET_TIPO AS "PET_TIPO",
                pessoa.PES_NOME AS "PES_NOME",
                usuario.USU_FOTO AS "USU_FOTO",
                JSON_VALUE(pet.PET_LOCAL, '$.lat') AS "PET_LOCAL_LAT",
                JSON_VALUE(pet.PET_LOCAL, '$.lng') AS "PET_LOCAL_LNG",
                JSON_VALUE(pet.PET_LOCAL, '$.rua') AS "PET_LOCAL_RUA",                
                JSON_VALUE(pet.PET_LOCAL, '$.bairro') AS "PET_LOCAL_BAIRRO",                
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
    }
}