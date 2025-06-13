import log from '../utils/logger.js'
import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb"; // Certifique-se de importar OracleDB aqui

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
    
}

export default new UserModel();