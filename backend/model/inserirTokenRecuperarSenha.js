import getConnection from "./connectionOracle.js";

async function inserirTokenRecuperacaoSenha(idUser, token, expired_time_token) {

    let connection;

    try {

        console.log("Iniciando conexão com BD para inserir Token na tabela de recuperar a senha")

        connection = await getConnection();

        const sqlQuery = `
            INSERT INTO 
            RECUPERAR_SENHA(REC_TOKEN, REC_DTLIMITE, USU_ID)
            VALUES(:token, :expired_time_token, :idUser)
            `;
        
        const binds = [
            token, expired_time_token, idUser
        ]

        const result = connection.execute(sqlQuery, binds, {autoCommit: true})
        
        console.log('Inserido o token e o relacionamento com sucesso na tabela RECUPERAR_SENHA')
        
    } catch (error) {
        console.error(error)
        throw new Error("Erro ao salvar o token de redefinição");
    } finally {
        if(connection)
            await connection.close();

        console.log("Fim da conexão com o banco de dados")
    }
    
}

export default inserirTokenRecuperacaoSenha;