import getConnection from "../model/connectionOracle.js";
import log from './logger.js'

class DBHelper {
    /**     
     * Executa uma operação de banco de dados garantindo que a conexão seja
     * aberta e fechada corretamente, e que os logs sejam registrados.
     * @param {object} logInfo - Informações de contexto para o log. Ex: { module: 'AdmModel', methodName: 'listar' }
     * @param {Function} callback - A função que contém a lógica da query, recebendo a conexão como argumento.
     * @returns {Promise<any>} O resultado da função de callback.
     */
    static async withConnection(logInfo, callback){ 
        const { module, methodName } = logInfo;
        let connection;
        try {
            log('INFO', module, methodName, 'INICIO');
            connection = await getConnection();
            const result = await callback(connection);
            log('INFO', module, methodName, 'FIM bem sucedido');
            return result;
        } catch (error) {
            log('ERRO', module, methodName, 'ERRO na operação');
            console.log(error);
            throw error;      
        } finally {
            if (connection) {
                try {
                    log('INFO', module, methodName, 'Encerrando Conexão');
                    await connection.close();
                    log('INFO', module, methodName, 'Conexão Encerrada');
                } catch (error) {
                    log('ERRO', module, methodName, 'Erro ao fechar conexão');
                    console.log(error);
                }
            }
        }
    }

    /**     
     * Executa uma série de operações de banco de dados como uma transação,
     * garantindo commit em caso de sucesso ou rollback em caso de erro.
     * @param {object} logInfo - Informações de contexto para o log. Ex: { module: 'AdmModel', methodName: 'deletar' }
     * @param {Function} callback - A função assíncrona que contém a lógica da transação, recebendo a conexão como argumento.
     * @returns {Promise<any>} O resultado da função de callback.
     */
    static async withTransaction(logInfo, callback){ 
        const { module, methodName } = logInfo
        let connection;
        try {
            log('INFO', module, methodName, 'INICIO');

            connection = await getConnection();

            const result = await callback(connection);
            await connection.commit();

            log('INFO', module, methodName, 'FIM COM COMMIT bem sucedido');
            return result;
        } catch (error) {

            log('ERRO', module, methodName, 'ERRO na operação', error.message);
            console.log(error);

            if (connection) {
                try {
                    await connection.rollback();
                    log('INFO', module, methodName, 'ROLLBACK concuído')
                } catch (rbError) {
                    log('ERRO', module, methodName, 'FALHA ao realizar ROLLBACK')
                    console.log(rbError);
                }
            }

            throw error;  
            
        } finally {
            if (connection) {
                try {
                    log('INFO', module, methodName, 'Encerrando Conexão');
                    await connection.close();
                    log('INFO', module, methodName, 'Conexão Encerrada');
                } catch (closeError) {
                    log('ERRO', module, methodName, 'Erro ao fechar conexão');
                    console.log(closeError);
                }
            }
        }
    }
}

export default DBHelper;