import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import log from '../utils/logger.js'
import fs from "fs";
import ValidationUtils from '../utils/ValidationUtils.js'

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
    pet.PET_FOTO AS "PET_FOTO",
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
            outFormat: OracleDB.OUT_FORMAT_OBJECT,
            fetchInfo: {
                PET_FOTO: { type: OracleDB.BUFFER }
            },
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
            outFormat: OracleDB.OUT_FORMAT_OBJECT,
            fetchInfo: {
                "PET_FOTO": { type: OracleDB.BUFFER },  // Garante que PET_FOTO venha como Buffer
                "USU_FOTO": { type: OracleDB.BUFFER }  // Garante que PET_FOTO venha como Buffer
            }
        }

        const result = await connection.execute(
            sql,
            binds,
            options
        );

        const posts = result.rows.map(row => {
            return {
                POS_ID: row.POS_ID,
                POS_TIPO: row.POS_TIPO,
                PET_NOME: row.PET_NOME,
                PET_DESCRICAO: row.PET_DESCRICAO,
                PET_FOTO: row.PET_FOTO ? row.PET_FOTO.toString('base64') : null,
               
                    PET_LOCAL_LAT: row.PET_LOCAL_LAT,
                    PET_LOCAL_LNG: row.PET_LOCAL_LNG,
                    PET_LOCAL_RUA: row.PET_LOCAL_RUA,
                    PET_LOCAL_BAIRRO: row.PET_LOCAL_BAIRRO,
                    PET_LOCAL_ENDERECO: row.PET_LOCAL_ENDERECO,
              
                PET_TIPO: row.PET_TIPO,
                PES_NOME: row.PES_NOME,
                USU_FOTO: row.USU_FOTO ? row.USU_FOTO.toString('base64') : null
            };
        });

        console.log("DENTRO MODEL --> ", posts);
        
        return posts
        
    } catch (error) {
        console.error("Erro Modal: ", error)
        throw error;               
    }
}

class PostModel {
    async lerImagem(img){
        return fs.readFileSync(img.path);
    }

    async encerrarImagem(img){
        return fs.unlinkSync(img.path);
    }

    async criarPublicacao(dadosPet, img){
        log('INFO', 'PostModel', 'criarPublicacao', 'INICIO');
        let connection;
        try {
            connection = await getConnection();
            
            log('INFO', 'PostModel', 'criarPublicacao', 'LER A IMG');
            console.log(img);
            
            const imgBinaria = await this.lerImagem(img);

            const imgSizeMB = (imgBinaria.length / (1024 * 1024)).toFixed(2);
            log('INFO', 'PostModel', 'criarPublicacao', `Imagem lida com sucesso: nome -> ${img.originalname || img.filename || 'desconhecido'}, tamanho -> ${imgSizeMB} MB`);

            const insertPet = await connection.execute(
                `
                    INSERT INTO PET (PET_NOME, PET_RGA, PET_TIPO, PET_DESCRICAO, PET_DATA, PET_FOTO, PET_LOCAL)
                    VALUES (:nome, :rga, :tipo, :descricao, TO_DATE(:data, 'DD-MM-YYYY'), :imagem, :local)
                    RETURNING PET_ID INTO :id
                `,{
                    nome: dadosPet.nome,
                    rga: dadosPet.rga,
                    tipo: dadosPet.tipoPet,
                    descricao: dadosPet.descricao,
                    data: dadosPet.data,
                    imagem: imgBinaria,
                    local: dadosPet.local,
                    id: { dir: OracleDB.BIND_OUT }
                }
            )

            log('INFO', 'PostModel', 'criarPublicacao', 'INSERT REALIZADO');

            try {
                await this.encerrarImagem(img)
                log('INFO', 'PostModel', 'criarPublicacao', 'IMG Encerrada');
            } catch (error) {
                log('ERRO', 'PostModel', 'criarPublicacao', 'ERRO AO ENCERRAR IMG');
                console.log(error);                
            }
            
            const petId = insertPet.outBinds.id[0];
            
            const insertPost = await connection.execute(
                `INSERT INTO POST (POS_TIPO, POS_DATA, PET_ID, USU_ID)
                VALUES (:tipo, SYSDATE, :idPet, :idUsuario)
                RETURNING POS_ID INTO :id`,
                {
                    tipo: "Perdido",
                    idPet: petId,
                    idUsuario: dadosPet.idUser,
                    id: { dir: OracleDB.BIND_OUT },
                }
            );

            const postId = insertPost.outBinds.id[0];

            log('INFO', 'PostModel', 'criarPublicacao', 'POST FEITO');
            
            // console.log(`
            //     ID PET   - ${petId}
            //     ID POST  - ${postId}
            //     `);
                
            await connection.commit();
                
            log('INFO', 'PostModel', 'criarPublicacao', 'COMMITADO COM SUCESSO ');
            
        } catch (error) {

            await connection.rollback();
            log('ERRO', 'PostModel', 'criarPublicacao', 'ROLLBACK FEITO');
            log('ERRO', 'PostModel', 'criarPublicacao', 'ERRO AO CADASTRAR PET');
            console.log(error);
            throw error;           
            
        } finally {
            if (connection) {
                try {
                    log('INFO', 'PostModel', 'criarPublicacao', 'Encerrando Conexão');
                    await connection.close();
                    log('INFO', 'PostModel', 'criarPublicacao', 'Conexão Encerrada');
                } catch (error) {
                    log('ERRO', 'PostModel', 'criarPublicacao', 'Erro ao fechar conexão');
                    console.log(error);
                    throw error
                }
            }
        }
    }

    async listarPosts(categoria, id = null){
        log('INFO', 'PostModel', 'listarPosts', 'INICIO');
        
        let connection;
        try {

            let sql;
            let binds = {}        

            if (categoria === 'todos') {
                sql = `
                        SELECT
                            post.POS_ID AS "POS_ID",
                            post.POS_TIPO AS "POS_TIPO",
                            pet.PET_NOME AS "PET_NOME",
                            pet.PET_DESCRICAO AS "PET_DESCRICAO",
                            pet.PET_FOTO AS "PET_FOTO",
                            pet.PET_LOCAL AS "PET_LOCAL",
                            pet.PET_DATA AS "POS_DATA",
                            pessoa.PES_NOME AS "PES_NOME",
                            usuario.USU_FOTO AS "USU_FOTO"
                        FROM POST, PET, USUARIO, PESSOA
                        WHERE
                            pet.PET_ID = post.PET_ID   AND
                            usuario.USU_ID = post.USU_ID AND
                            pessoa.PES_ID = usuario.PES_ID
                    `;
            } 

            if (categoria === "individual") {
                sql = `
                    SELECT
                        post.POS_ID AS "POS_ID",
                        post.POS_TIPO AS "POS_TIPO",
                        pet.PET_NOME AS "PET_NOME",
                        pet.PET_DESCRICAO AS "PET_DESCRICAO",
                        pet.PET_FOTO AS "PET_FOTO",
                        pet.PET_LOCAL AS "PET_LOCAL",
                        pet.PET_DATA AS "POS_DATA",
                        pessoa.PES_NOME AS "PES_NOME",
                        usuario.USU_FOTO AS "USU_FOTO"
                    FROM POST, PET, USUARIO, PESSOA
                    WHERE
                        pet.PET_ID = post.PET_ID   AND
                        usuario.USU_ID = post.USU_ID AND
                        pessoa.PES_ID = usuario.PES_ID AND
                        usuario.USU_ID = :id
                `
                binds = {id: id}
            }

            if (categoria === "Perdido" || categoria === "Encontrado") {
                sql = `
                    SELECT
                        post.POS_TIPO AS "POS_TIPO",
                        pet.PET_NOME AS "PET_NOME",
                        pet.PET_DESCRICAO AS "PET_DESCRICAO",
                        pet.PET_FOTO AS "PET_FOTO",
                        pet.PET_LOCAL AS "PET_LOCAL",
                        pet.PET_DATA AS "POS_DATA",
                        pessoa.PES_NOME AS "PES_NOME",
                        usuario.USU_FOTO AS "USU_FOTO"
                    FROM POST, PET, USUARIO, PESSOA
                    WHERE
                        pet.PET_ID = post.PET_ID   AND
                        usuario.USU_ID = post.USU_ID AND
                        pessoa.PES_ID = usuario.PES_ID  AND
                        post.POS_TIPO = :tipo
                `

                binds = {tipo: categoria}
            }

            const options = {
                fetchInfo: {
                    PET_FOTO: { type: OracleDB.BUFFER },
                    USU_FOTO: { type: OracleDB.BUFFER },
                },
                outFormat: OracleDB.OUT_FORMAT_OBJECT,
            }

            connection = await getConnection();

            const { rows } = await connection.execute(
                sql, binds, options
            );

            log('INFO', 'PostModel', 'listarPosts', 'TRATAR IMAGENS');
            
            const dadosTratados = await ValidationUtils.tratarImagensEData(rows);
            
            log('INFO', 'PostModel', 'listarPosts', 'FIM');

            return dadosTratados;
            
        } catch (error) {

            log('ERRO', 'PostModel', 'listarPosts', 'ERRO AO LISTAR POSTS');
            console.log(error);
            throw error;
            
        } finally {
            if (connection) {
                try {
                    log('INFO', 'PostModel', 'listarPosts', 'Encerrando Conexão');
                    await connection.close();
                    log('INFO', 'PostModel', 'listarPosts', 'Conexão Encerrada');
                } catch (error) {
                    log('ERRO', 'PostModel', 'listarPosts', 'Erro ao fechar conexão');
                    console.log(error);
                    throw error
                }
            }
        }
    }
}

export default new PostModel();