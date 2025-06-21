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
}

export default new NotificationModel();