import OracleDB from "oracledb";
import getConnection from "./connectionOracle.js";

export default async function inserirUsuario(dados) {
  let connection;

  try {
    connection = await getConnection();
    console.log("Iniciando a conexão...\n \n");

    const verificaEmail = `
      SELECT COUNT(*) AS TOTAL
      FROM USUARIO
      WHERE USU_EMAIL = :email
    `;
    const resultadoEmail = await connection.execute(verificaEmail, {
      email: dados.email,
    });

    const verificaTelefone = `
      SELECT COUNT(*) AS TOTAL
      FROM PESSOA
      WHERE PES_PHONE = :telefone
    `;
    const resultadoTelefone = await connection.execute(verificaTelefone, {
      telefone: dados.telefone,
    });

    if (resultadoEmail.rows[0][0] > 0 && resultadoTelefone.rows[0][0] > 0) {
      throw new Error("O e-mail e o telefone já estão cadastrados.");
    } else if(resultadoEmail.rows[0][0] > 0) {
      throw new Error("O e-mail já está cadastrado.");
    } else if (resultadoTelefone.rows[0][0] > 0) {
      throw new Error("O telefone já está cadastrado.");
    }

    /**
     * ESTADO  (id)
     * CIDADE  (insert com relação)
     */

    // pega ID estado
    const selectEstado = `
      SELECT EST_ID 
      FROM ESTADO 
      WHERE EST_SIGLA = :sigla
     `;
    const resultadoSelectEstado = await connection.execute(selectEstado, {
      sigla: dados.estado,
    });
    const idEstado = resultadoSelectEstado.rows[0][0];

    // insert cidade
    const insertCidade = ` 
      INSERT INTO CIDADE (CID_DESCRICAO, EST_ID) 
      VALUES (:cidade, :idEstado) 
      RETURNING CID_ID INTO :id 
     `;
    const resultadoInsertCidade = await connection.execute(
      insertCidade,
      {
        cidade: dados.cidade,
        idEstado: idEstado,
        id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT }, // extraindo id Cidade
      },
      { autoCommit: true }
    );

    // guardando ID cidade
    const idCidade = resultadoInsertCidade.outBinds.id[0];

    /**
     * ENDERECO (atribuir ID CIDADE)
     */

    // insert endereco
    const insertEndereco = `
      INSERT INTO ENDERECO (END_RUA, END_BAIRRO, END_CEP, CID_ID) 
      VALUES (:rua, :bairro, :cep, :idCidade) 
      RETURNING END_ID INTO :id
     `;
    const resultadoInsertEndereco = await connection.execute(
      insertEndereco,
      {
        rua: dados.rua,
        bairro: dados.bairro,
        cep: dados.cep,
        idCidade: idCidade,
        id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT },
      },
      { autoCommit: true }
    );

    const idEndereco = resultadoInsertEndereco.outBinds.id[0];

    /**
     * PESSOA (pegar id endereco)
     */

    // insert
    const insertPessoa = `
      INSERT INTO PESSOA (PES_NOME, PES_PHONE, END_ID)
      VALUES (:nome, :telefone, :idEndereco)
      RETURNING PES_ID INTO :id
    `;
    const resultadoInsertPessoa = await connection.execute(
      insertPessoa,
      {
        nome: dados.nome,
        telefone: dados.telefone,
        idEndereco: idEndereco,
        id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT },
      },
      { autoCommit: true }
    );

    const idPessoa = resultadoInsertPessoa.outBinds.id[0];

    /**
     * USUARIO (pegar id pessoa)
     *
     */

    const inserttUsuario = `
      INSERT INTO USUARIO (USU_EMAIL, USU_SENHA, PES_ID) 
      VALUES (:email, :senha, :idPessoa)
    `;
    const resultadoInsertUsuario = await connection.execute(
      inserttUsuario,
      {
        email: dados.email,
        senha: dados.senha,
        idPessoa: idPessoa,
      },
      { autoCommit: true }
    );

    const queryFinal = `
      SELECT  P.PES_NOME, U.USU_EMAIL, U.USU_SENHA, P.PES_PHONE, E.END_RUA, E.END_BAIRRO, E.END_CEP, C.CID_DESCRICAO, ES.EST_SIGLA
      FROM    PESSOA P, USUARIO U, ENDERECO E, CIDADE C, ESTADO ES
      WHERE   
        ES.EST_ID = C.EST_ID      AND
        C.CID_ID  = E.CID_ID      AND
        E.END_ID  = P.END_ID      AND
        P.PES_ID  = U.PES_ID
    `;
    const resultadoQueryFinal = await connection.execute(queryFinal, []);
    console.log(resultadoQueryFinal.rows);

    // Confirma a transação
    await connection.commit();

    console.log("Fechando a conexão...");
    await connection.close();
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);

    // Realiza o rollback em caso de erro
    if (connection) {
      try {
        await connection.rollback();
        console.log("Rollback realizado com sucesso.");
      } catch (rollbackError) {
        console.error("Erro ao realizar rollback:", rollbackError);
      }
    }

    throw error;
  }
}
