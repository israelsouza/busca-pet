import log from '../utils/logger.js'
import getConnection from "./connectionOracle.js";

class NotificationModel{
    async listarNotificacoes(id){
        log('INFO', 'UserModel', 'listarNotificacoes', 'INICIO');
        let connection;
        try {

            connection = await getConnection();

            const { rows } = await connection.execute(
                `
                    SELECT
                        PES_NOME, NOT_REMETENTE_ID, NOT_DATA_CRIACAO, NOT_CONTEUDO, NOT_ID
                    FROM NOTIFICACOES, PESSOA, USUARIO
                    WHERE 
                        PESSOA.PES_ID = USUARIO.USU_ID AND
                        USUARIO.USU_ID = NOT_REMETENTE_ID AND
                        NOT_DESTINATARIO_ID = :id
                `,[id]
            );
            
            log('INFO', 'UserModel', 'listarNotificacoes', 'FIM bem sucedido');
            return rows;
            
        } catch (error) {
            log('ERROR', 'UserModel', 'listarNotificacoes', 'Erro ao listar as notificações', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'listarNotificacoes', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'listarNotificacoes', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'listarNotificacoes', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async deletarNotificacao(idNot, idUser){
        log('INFO', 'UserModel', 'deletarNotificacao', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            const result = await connection.execute(
            `
                DELETE FROM NOTIFICACOES
                WHERE NOT_ID = :idNot AND NOT_DESTINATARIO_ID = :idUser
            `,
            { idNot, idUser },
            { autoCommit: true }
            );

            log('INFO', 'UserModel', 'deletarNotificacao', 'FIM bem sucedido');
            return result.rowsAffected > 0;

        } catch (error) {
            log('ERROR', 'UserModel', 'deletarNotificacao', 'Erro ao deletar a notificação', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'deletarNotificacao', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'deletarNotificacao', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'deletarNotificacao', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async salvarNotificacao(dados){
        log('INFO', 'UserModel', 'salvarNotificacao', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            await connection.execute(
                `
                    INSERT INTO NOTIFICACOES (NOT_REMETENTE_ID, NOT_DESTINATARIO_ID, NOT_CONTEUDO)
                    VALUES (:remetente, :destinatario, :conteudo)
                `,
                {
                    remetente: dados.rementente,
                    destinatario: dados.destinatario,
                    conteudo: dados.conteudo
                },
                { autoCommit: true }
            );

            log('INFO', 'UserModel', 'salvarNotificacao', 'FIM bem sucedido');

        } catch (error) {
            log('ERROR', 'UserModel', 'salvarNotificacao', 'Erro ao salvar a notificação', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'salvarNotificacao', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'salvarNotificacao', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'salvarNotificacao', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async salvarUmaDenuncia(idUsuario, idPost, descricao, tipo, data){
        log('INFO', 'UserModel', 'salvarUmaDenuncia', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            await connection.execute(
            `
                INSERT INTO DENUNCIAS (DEN_TIPO, DEN_DESCRICAO, DEN_DATA, USU_ID, POS_ID)
                VALUES (:tipo, :descricao, :data, :userId, :idPost)
            `,
            {
                tipo,
                descricao,
                data,
                userId: idUsuario,
                idPost,
            },
            { autoCommit: true }
            );

            log('INFO', 'UserModel', 'salvarUmaDenuncia', 'FIM bem sucedido');

            return { success: true, message: "Denúncia registrada com sucesso!" };

        } catch (error) {
            log('ERROR', 'UserModel', 'salvarUmaDenuncia', 'Erro ao salvar a denúncia', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', 'UserModel', 'salvarUmaDenuncia', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', 'UserModel', 'salvarUmaDenuncia', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', 'UserModel', 'salvarUmaDenuncia', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }
}

export default new NotificationModel();