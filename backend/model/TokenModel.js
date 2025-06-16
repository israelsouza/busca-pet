import log from '../utils/logger.js'
import getConnection from "./connectionOracle.js";

class TokenModel {
    async invalidarTokensAntigos(id){
        log('INFO', 'TokenModel', 'invalidarTokensAntigos', 'INICIO')
        let connection;
        try {
            connection = await getConnection();

            await connection.execute(
                `
                    DELETE FROM RECUPERAR_SENHA
                    WHERE USU_ID = :idUser
                    AND REC_DTLIMITE > SYSDATE
                `, [id], { autoCommit: true}
            );

            log('INFO', 'TOKENSERVICE', 'criarTokenSenha', 'FIM')
            return true;
        } catch (error) {
            log('ERROR', 'TokenModel', 'invalidarTokensAntigos', 'ERRO AO EXCLUIR REGISTRO')
            console.log(error);
            return false;            
        } finally {
            if(connection) {
                try {
                    log('INFO', 'TokenModel', 'invalidarTokensAntigos', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'TokenModel', 'invalidarTokensAntigos', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'TokenModel', 'invalidarTokensAntigos', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);                    
                }
            }
        }

    }

    async salvarTokenSenha(id, token, tempo_expiracao){
        log('INFO', 'TokenModel', 'salvarTokenSenha', 'INICIO')
        let connection;
        try {
            connection = await getConnection();
            
            await connection.execute(
                `
                INSERT INTO 
                RECUPERAR_SENHA(REC_TOKEN, REC_DTLIMITE, USU_ID)
                VALUES(:token, :expired_time_token, :idUser)
                `, [token, tempo_expiracao, id ],
                { autoCommit: true}
            );
            
            log('INFO', 'TokenModel', 'salvarTokenSenha', 'FIM')

            return true;

        } catch (error) {
            log('ERROR', 'TokenModel', 'salvarTokenSenha', 'ERRO AO REGISTRAR O TOKEN NO BANCO')
            console.log(error);
            
            return false;
            
        } finally {
            if(connection) {
                try {
                    log('INFO', 'TokenModel', 'salvarTokenSenha', 'ENCERRANDO CONEXÃO COM BANCO')
                    await connection.close();
                    log('INFO', 'TokenModel', 'salvarTokenSenha', 'CONEXÃO ENCERRADA')
                } catch (error) {
                    log('ERROR', 'TokenModel', 'salvarTokenSenha', 'ERRO AO ENCERRAR A CONEXÃO')
                    console.log(error);                    
                }
            }
        }
    }
}

export default new TokenModel();