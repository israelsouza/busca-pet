import ValidationUtils from '../utils/ValidationUtils.js';
import log from '../utils/logger.js'
import getConnection from "./connectionOracle.js";
import bcrypt from "bcrypt";
import OracleDB from "oracledb";
import HttpError from '../utils/HttpError.js';
import DBHelper from '../utils/dbHelper.js';

class UserModel {
    async salvarUsuario(dados){
        log('INFO', 'UserModel', 'salvarUsuario', 'INICIO')
        let connection;
        try {
            connection = await getConnection();

            const resultadoEmail = await connection.execute(
                `
                    SELECT COUNT(*) AS TOTAL
                    FROM USUARIO
                    WHERE USU_EMAIL = :email
                `,
                [dados.email]
            )            

            if (resultadoEmail.rows[0][0] > 0){
                log('ERROR','UserModel','salvarUsuario','EMAIL JA CADASTRADO')
                throw new Error("O e-mail já esta cadastrado");
            }

            const resultadoTelefone = await connection.execute(
                `
                    SELECT COUNT(*) AS TOTAL
                    FROM PESSOA
                    WHERE PES_PHONE = :telefone
                `, 
                [dados.telefone]
            )

            if (resultadoTelefone.rows[0][0] > 0){
                log('ERROR','UserModel','salvarUsuario','TELEFONE JA CADASTRADO')
                throw new Error("O telefone já esta cadastrado");
            }

            log('INFO', 'UserModel', 'salvarUsuario', 'Email e Telefones não usados anteriormente')

            const resultadoEstado = await connection.execute(
                `
                    SELECT EST_ID 
                    FROM ESTADO 
                    WHERE EST_SIGLA = :sigla
                `,
                [dados.estado]
            )

            log('INFO', 'UserModel', 'salvarUsuario', 'EIS O ESTADO')

            if (resultadoEstado.rows.length === 0)
                throw new Error(`Estado com a sigla ${dados.estado} não encontrado.`);

            const idEstado = resultadoEstado.rows[0][0];

            const resultadoCidade = await connection.execute(
                `
                    INSERT INTO CIDADE (CID_DESCRICAO, EST_ID) 
                    VALUES (:cidade, :idEstado) 
                    RETURNING CID_ID INTO :id 
                `,
                {
                    cidade: dados.cidade,
                    idEstado,
                    id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT }
                }                
            )
            
            const idCidade = resultadoCidade.outBinds.id[0];

            log('INFO', 'UserModel', 'salvarUsuario', 'Cidade Inserida com sucesso')
            console.log("id cidade: ", idCidade);
            

            const resultadoEndereco = await connection.execute(
                `
                    INSERT INTO ENDERECO (END_RUA, END_BAIRRO, END_CEP, CID_ID) 
                    VALUES (:rua, :bairro, :cep, :idCidade) 
                    RETURNING END_ID INTO :id
                `,
                {
                    rua: dados.rua,
                    bairro: dados.bairro,
                    cep: dados.cep,
                    idCidade: idCidade,
                    id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT },
                }
            );

            const idEndereco = resultadoEndereco.outBinds.id[0];

            log('INFO', 'UserModel', 'salvarUsuario', 'Endereco completo Inserido com sucesso')
            console.log("id endereco: ", idEndereco);

            const resultadoPessoa = await connection.execute(
                `
                    INSERT INTO PESSOA (PES_NOME, PES_PHONE, END_ID)
                    VALUES (:nome, :telefone, :idEndereco)
                    RETURNING PES_ID INTO :id
                `,{
                    nome: dados.nome,
                    telefone: dados.telefone,
                    idEndereco: idEndereco,
                    id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT },
                }
            );

            const idPessoa = resultadoPessoa.outBinds.id[0];

            log('INFO', 'UserModel', 'salvarUsuario', 'Pessoa inserida com sucesso')
            console.log("id pessoa: ", idPessoa);

            const resultadoUsuario = await connection.execute(
                `
                    INSERT INTO USUARIO (USU_EMAIL, USU_SENHA, PES_ID) 
                    VALUES (:email, :senha, :idPessoa)
                `, {
                    email: dados.email,
                    senha: dados.senha,
                    idPessoa: idPessoa,
                }
            );

            await connection.commit();

            log('INFO', 'UserModel', 'salvarUsuario', 'Usuario completo inserido com sucesso')
            console.log("usuario: ", resultadoUsuario);          

            log('INFO', 'UserModel', 'salvarUsuario', 'FIM')

            return true
            
        } catch (error) {
            log('ERROR','UserModel','salvarUsuario','Falha ao criar o usuario',{error})
            await connection.rollback();
            log('INFO','UserModel','salvarUsuario','Rollback com sucesso')
            throw error
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    throw error;
                }
            }
        }

    }

    async logarUsuario(dados){
        log('INFO', 'UserModel', 'logarUsuario', 'INICIO')
        let connection;
        try {
            connection = await getConnection();

            const query = await connection.execute(
                `
                    SELECT USU_ID, USU_SENHA, USU_ROLE, USU_STATUS
                    FROM USUARIO
                    WHERE LOWER(USU_EMAIL) = :email AND
                        USU_STATUS = 'A'
                `,
                [dados.email]
            )

            if (query.rows.length === 0) {
                log('ERROR', 'UserModel', 'logarUsuario', 'EMAIL NÃO CADASTRADO')
                throw new Error("O e-mail não está cadastrado.");
            }

            const [USU_ID, senhaHash, role] = query.rows[0];            

            const senhaValida = await bcrypt.compare(dados.password, senhaHash);

            if (!senhaValida) {
                log('ERROR', 'UserModel', 'logarUsuario', 'SENHA INCORRETA')
                throw new Error("Senha incorreta");
            }

            log('INFO', 'UserModel', 'logarUsuario', 'SENHA CORRETA, FIM MODEL')
            
            return { 
                userId: USU_ID,
                message: "Usuário autenticado com sucesso.",
                role: role,
                email: dados.email
            };

        } catch (error) {
            log('ERROR', 'UserModel', 'logarUsuario', 'ERRO AO LOGAR USUARIO')
            console.log(error);
            throw error;
            

        } finally{
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'logarUsuario', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'logarUsuario', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'logarUsuario', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);                    
                }
            }
        }
    }

    async pegarIdUsuarioPeloEmail(email){
        log('INFO', 'UserModel', 'pegarIdUsuarioPeloEmail', 'INICIO')
        let connection;
        try {
            connection = await getConnection();
            
            const userId = await connection.execute(
                `SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = :email`,
                [email]
            );
            
            log('INFO', 'UserModel', 'pegarIdUsuarioPeloEmail', 'FIM')
            return userId.rows.length > 0 ? userId.rows[0][0] : null;
        } catch (error) {
            log('ERROR', 'UserModel', 'pegarIdUsuarioPeloEmail', 'ERRO AO CAPTURAR O USUARIO')
            console.log(error);
            throw error;
        } finally {
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'pegarIdUsuarioPeloEmail', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'pegarIdUsuarioPeloEmail', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'pegarIdUsuarioPeloEmail', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);                    
                }
            }
        }
    }

    async salvarSenha(senha, email) {
        log('INFO', 'UserModel', 'salvarSenha', 'INICIO')
        let connection;
        try {
            connection = await getConnection();
            
            const result = await connection.execute(
                `
                UPDATE USUARIO
                SET USU_SENHA = :newPassword
                WHERE USU_EMAIL = :email
                `, [senha, email], {autoCommit: true}
            );
            
            log('INFO', 'UserModel', 'salvarSenha', 'FIM')

            return result.rowsAffected > 0;
            
        } catch (error) {

            log('ERROR', 'UserModel', 'salvarSenha', 'ERRO AO SALVAR NOVA SENHA')
            console.log(error);
            throw error;
            
        } finally {
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'salvarSenha', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'salvarSenha', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'salvarSenha', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);                    
                }
            }
        }
    }

    async buscarfotoUsuario(id){
        log('INFO', 'UserModel', 'buscarfotoUsuario', 'INICIO')
        let connection;
        try {

            connection = await getConnection();

            const result = await connection.execute(
                `
                    SELECT 
                        USUARIO.USU_FOTO AS "USU_FOTO"
                    FROM USUARIO, PESSOA
                    WHERE
                        PESSOA.PES_ID = USUARIO.PES_ID AND
                        USUARIO.USU_ID = :id
                
                `, [id], {
                    fetchInfo: {
                        USU_FOTO: { type: OracleDB.BUFFER },
                    },
                    outFormat: OracleDB.OUT_FORMAT_OBJECT,
                }
            );

            if ( result.rows.length > 0 ) {
                log('INFO', 'UserModel', 'buscarfotoUsuario', 'IMG encontrada')
                const dadosTratados = await ValidationUtils.tratarImagem(result.rows);

                return dadosTratados[0]
            } else {
                log('INFO', 'UserModel', 'buscarfotoUsuario', 'Não há foto salva')
                return null
            }
            
        } catch (error) {

            log('ERROR', 'UserModel', 'buscarfotoUsuario', 'Erro ao buscar foto')
            console.log(error);            
            throw error;

        } finally {
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'buscarfotoUsuario', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'buscarfotoUsuario', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'buscarfotoUsuario', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);
                }
            }
        }
    }

    async buscarfotoUsuarioComNome(id){
        log('INFO', 'UserModel', 'buscarfotoUsuario', 'INICIO')
        let connection;
        try {

            connection = await getConnection();

            const result = await connection.execute(
                `
                    SELECT 
                        USUARIO.USU_FOTO AS "USU_FOTO",
                        PESSOA.PES_NOME AS "PES_NOME"
                    FROM USUARIO, PESSOA
                    WHERE
                        PESSOA.PES_ID = USUARIO.PES_ID AND
                        USUARIO.USU_ID = :id
                
                `, [id], {
                    fetchInfo: {
                        USU_FOTO: { type: OracleDB.BUFFER },
                    },
                    outFormat: OracleDB.OUT_FORMAT_OBJECT,
                }
            );

            if ( result.rows.length > 0 ) {
                log('INFO', 'UserModel', 'buscarfotoUsuario', 'IMG encontrada')
                const dadosTratados = await ValidationUtils.tratarImagem(result.rows);

                return dadosTratados[0]
            } else {
                log('INFO', 'UserModel', 'buscarfotoUsuario', 'Não há foto salva')
                return null
            }
            
        } catch (error) {

            log('ERROR', 'UserModel', 'buscarfotoUsuario', 'Erro ao buscar foto')
            console.log(error);            
            throw error;

        } finally {
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'buscarfotoUsuario', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'buscarfotoUsuario', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'buscarfotoUsuario', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);
                }
            }
        }
    }

    async listarDadosUsuario(id){
        log('INFO', 'UserModel', 'listarDadosUsuario', 'INICIO')
        let connection;
        try {
            connection = await getConnection();

            const result = await connection.execute(
            `
            SELECT 
             PESSOA.PES_NOME,
             PESSOA.PES_PHONE,
             USUARIO.USU_EMAIL,
             ENDERECO.END_RUA,
             ENDERECO.END_BAIRRO,
             CIDADE.CID_DESCRICAO,
             ESTADO.EST_SIGLA,
             USUARIO.USU_STATUS
            FROM
             PESSOA,
             USUARIO,
             ENDERECO,
             CIDADE,
             ESTADO
            WHERE
               ESTADO.EST_ID = CIDADE.EST_ID      AND
               CIDADE.CID_ID = ENDERECO.CID_ID    AND
               ENDERECO.END_ID = PESSOA.END_ID    AND
               PESSOA.PES_ID = USUARIO.PES_ID     AND
               USUARIO.USU_ID = :id                
            `, [id], { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            );

            log('INFO', 'UserModel', 'listarDadosUsuario', 'FIM')

            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }

        } catch (error) {
            log('ERROR', 'UserModel', 'listarDadosUsuario', 'ERRO AO LISTAR DADOS DO USUARIO')
            console.log(error);
            throw error;
        } finally {
            if(connection) {
                try {
                    log('INFO', 'UserModel', 'listarDadosUsuario', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'UserModel', 'listarDadosUsuario', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'UserModel', 'listarDadosUsuario', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);
                }
            }
        }
    }

    async listarUsuariosEDenuncias(){
        return DBHelper.withConnection({ module: "AdmModel", methodName: "listarUsuariosEDenuncias" }, async (connection) => {
        const result = await connection.execute(
            `
            SELECT
                U.USU_ID AS id,
                P.PES_NOME AS PES_NOME,
                U.USU_STATUS AS USU_STATUS,
                U.USU_EMAIL AS USU_EMAIL,
                U.USU_REPORTS_COUNT AS denuncias_recebidas_count
            FROM
                USUARIO U
            INNER JOIN
                PESSOA P ON U.PES_ID = P.PES_ID 
            ORDER BY
                USU_STATUS ASC,                 
                denuncias_recebidas_count DESC, 
                PES_NOME ASC  
                `,
            [],
            {
            outFormat: OracleDB.OUT_FORMAT_OBJECT,
            }
        )

        return result.rows
        })
    }

    async banirUsuario(id){
        return DBHelper.withTransaction({module: 'AdmModel', methodName: 'banirUsuario'}, async (connection) => {
            await connection.execute(
                ` UPDATE USUARIO SET USU_STATUS = 'B' WHERE USU_ID = :id `, [id]
            )

            return { success: true, message: 'Usuário banido e e-mail enviado com sucesso.' }
        })
    }

    async atualizarCampoUsuario(id, campo, valor){
        log('INFO', 'UserModel', 'atualizarCampoUsuario', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            let query = '';
            let bindParams = {};

            const idsResult = await connection.execute(
            `SELECT u.PES_ID, p.END_ID
             FROM USUARIO u
             JOIN PESSOA p ON u.PES_ID = p.PES_ID
             WHERE u.USU_ID = :id`,
            { id },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            );

            if (idsResult.rows.length === 0)
                throw new Error("Usuário não encontrado.");

            const { PES_ID, END_ID } = idsResult.rows[0];

            switch (campo) {
            case 'PES_NOME':
                query = `UPDATE PESSOA SET PES_NOME = :valor WHERE PES_ID = :targetId`;
                bindParams = { valor, targetId: PES_ID };
                break;
            case 'PES_PHONE':
                query = `UPDATE PESSOA SET PES_PHONE = :valor WHERE PES_ID = :targetId`;
                bindParams = { valor, targetId: PES_ID };
                break;
            case 'USU_EMAIL':
                query = `UPDATE USUARIO SET USU_EMAIL = :valor WHERE USU_ID = :targetId`;
                bindParams = { valor, targetId: id };
                break;
            case 'END_RUA':
                query = `UPDATE ENDERECO SET END_RUA = :valor WHERE END_ID = :targetId`;
                bindParams = { valor, targetId: END_ID };
                break;
            case 'END_BAIRRO':
                query = `UPDATE ENDERECO SET END_BAIRRO = :valor WHERE END_ID = :targetId`;
                bindParams = { valor, targetId: END_ID };
                break;
            case 'CID_DESCRICAO':
                query = `UPDATE CIDADE SET CID_DESCRICAO = :valor WHERE CID_ID = (SELECT CID_ID FROM ENDERECO WHERE END_ID = :targetId)`;
                bindParams = { valor, targetId: END_ID };
                break;
            case 'EST_SIGLA':
                query = `
                    UPDATE ESTADO
                    SET EST_SIGLA = :valor
                    WHERE EST_ID = (
                        SELECT c.EST_ID
                        FROM CIDADE c
                        WHERE c.CID_ID = (SELECT e.CID_ID FROM ENDERECO e WHERE e.END_ID = :targetId)
                    )
                `;
                bindParams = { valor, targetId: END_ID };
                break;
            default:
                throw new Error(`Campo '${campo}' não é atualizável ou não existe.`);
            }

            const result = await connection.execute(query, bindParams, { autoCommit: true });

            log('INFO', 'UserModel', 'atualizarCampoUsuario', 'FIM');
            return result.rowsAffected > 0;

        } catch (error) {
            log('ERROR', 'UserModel', 'atualizarCampoUsuario', 'ERRO AO ATUALIZAR CAMPO DO USUARIO', { error });
            console.log(error);

            if (connection)
                await connection.rollback();

            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'atualizarCampoUsuario', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'atualizarCampoUsuario', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'atualizarCampoUsuario', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async salvarNovaFoto(id, binario){;
        log('INFO', 'UserModel', 'salvarNovaFoto', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            const result = await connection.execute(
            `UPDATE USUARIO SET USU_FOTO = :foto WHERE USU_ID = :id`,
            {
                foto: binario,
                id: id
            },
            { autoCommit: true }
            );

            log('INFO', 'UserModel', 'salvarNovaFoto', 'FIM bem sucedido');
            return result.rowsAffected > 0;

        } catch (error) {
            log('ERROR', 'UserModel', 'salvarNovaFoto', 'Erro ao salvar nova foto', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'salvarNovaFoto', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'salvarNovaFoto', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'salvarNovaFoto', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async findPhoneByUserId(id){
        log('INFO', 'UserModel', 'findPhoneByUserId', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            const result = await connection.execute(
            `
                SELECT p.PES_PHONE
                FROM PESSOA p
                JOIN USUARIO u ON p.PES_ID = u.PES_ID
                WHERE u.USU_ID = :id
            `,
            [id]
            );

            if (result.rows.length === 0)
                throw new HttpError(404, "Publicação não encontrada.")            

            log('INFO', 'UserModel', 'findPhoneByUserId', 'FIM');

            return result.rows[0][0];

        } catch (error) {
            log('ERROR', 'UserModel', 'findPhoneByUserId', 'Erro ao buscar telefone', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'findPhoneByUserId', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'findPhoneByUserId', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'findPhoneByUserId', 'ERRO AO ENCERRAR A CONEXÃO', { error });
                console.log(error);
                throw error;
            }
            }
        }
    }

    async findNameById(id) {
        log('INFO', 'UserModel', 'findNameById', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            const result = await connection.execute(
                `
                    SELECT p.PES_NOME
                    FROM PESSOA p
                    JOIN USUARIO u ON p.PES_ID = u.PES_ID
                    WHERE u.USU_ID = :id
                `, [id]
            );

            if (result.rows.length === 0)
                throw new HttpError(404, "Usuário não encontrado.")

            log('INFO', 'UserModel', 'findNameById', 'FIM');

            return result.rows[0][0];

        } catch (error) {
            log('ERROR', 'UserModel', 'findNameById', 'Erro ao buscar nome', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
                try {
                    log('INFO', 'UserModel', 'findNameById', 'ENCERRANDO CONEXÃO COM BANCO');
                    await connection.close();
                    log('INFO', 'UserModel', 'findNameById', 'CONEXÃO ENCERRADA');
                } catch (error) {
                    log('ERROR', 'UserModel', 'findNameById', 'ERRO AO ENCERRAR A CONEXÃO', { error });
                    console.log(error);
                    throw error;
                }
            }
        }
    }
    
}

export default new UserModel();