import getConnection  from "./connectionOracle";

export default async function inserirUsuario(dados) {
  let connection;

  try {
    connection = await getConnection()

    await connection.execute("BEGIN")

    // validação de chave unica

    // 1. Verificar se o e-mail já existe
    const emailQuery = `SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = :email`;
    const emailResult = await connection.execute(emailQuery, { email: dados.email });

    if (emailResult.rows.length > 0) {
      throw new Error("O e-mail já está cadastrado.");
    }

    // 2. Verificar se o telefone já existe
    const phoneQuery = `SELECT PES_ID FROM PESSOA WHERE PES_PHONE = :phone`;
    const phoneResult = await connection.execute(phoneQuery, { phone: dados.phone });

    if (phoneResult.rows.length > 0) {
      throw new Error("O telefone já está cadastrado.");
    }

    // inserção dos dados

    // 1. Buscar o ID do estado
    const estadoQuery = `SELECT EST_ID FROM ESTADO WHERE EST_SIGLA = :estado`;
    const estadoResult = await connection.execute(estadoQuery, { estado: dados.estado });
    const estadoId = estadoResult.rows[0][0];

    // 2. Inserir na tabela CIDADE
    const cidadeQuery = `
      INSERT INTO CIDADE (CID_DESCRICAO, EST_ID)
      VALUES (:cidade, :estadoId)
      RETURNING CID_ID INTO :cidadeId
    `;
    const cidadeResult = await connection.execute(cidadeQuery, {
      cidade: dados.cidade,
      estadoId,
    });
    const cidadeId = cidadeResult.outBinds.cidadeId[0];

    // 3. Inserir na tabela ENDERECO
    const enderecoQuery = `
      INSERT INTO ENDERECO (END_RUA, END_BAIRRO, END_CEP, CID_ID)
      VALUES (:rua, :bairro, :cep, :cidadeId)
      RETURNING END_ID INTO :enderecoId
    `;
    const enderecoResult = await connection.execute(enderecoQuery, {
      rua: dados.rua,
      bairro: dados.bairro,
      cep: dados.cep,
      cidadeId,
    });
    const enderecoId = enderecoResult.outBinds.enderecoId[0];

    // 4. Inserir na tabela PESSOA
    const pessoaQuery = `
      INSERT INTO PESSOA (PES_NOME, PES_PHONE, END_ID)
      VALUES (:nome, :phone, :enderecoId)
      RETURNING PES_ID INTO :pessoaId
    `;
    const pessoaResult = await connection.execute(pessoaQuery, {
      nome: dados.nome,
      phone: dados.phone,
      enderecoId,
    });
    const pessoaId = pessoaResult.outBinds.pessoaId[0];

    // 5. Inserir na tabela USUARIO
    const usuarioQuery = `
      INSERT INTO USUARIO (USU_EMAIL, USU_SENHA, PES_ID)
      VALUES (:email, :senha, :pessoaId)
    `;
    await connection.execute(usuarioQuery, {
      email: dados.email,
      senha: dados.senha,
      pessoaId,
    });

    // Confirma a transação
    await connection.execute("COMMIT");

    console.log("Usuário inserido com sucesso!");
    

  } catch (error) {
    // Reverte a transação em caso de erro
    if (connection) {
        await connection.execute("ROLLBACK");
      }
      console.error("Erro ao inserir usuário:", err);
      throw err;
  } finally {
    // Fecha a conexão
    if (connection) {
      await connection.close();
    }
  }

}