import bcrypt from 'bcrypt'
import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import formatarDataParaDDMMYYYY from '../utils/formatarData.js'
import transporter from "../configs/mailConfig.js";
import { myEmail } from "../configs/myEmail.js";

async function salvarDenuncia(tipo, descricao, idPost, userId) {
  let connection;

  try {
    connection = await getConnection();

    const dataAtualObj = new Date();
    const dataAtual = `${String(dataAtualObj.getDate()).padStart(
      2,
      "0"
    )}/${String(dataAtualObj.getMonth() + 1).padStart(
      2,
      "0"
    )}/${dataAtualObj.getFullYear()}`;

    await connection.execute(
      `INSERT INTO DENUNCIAS (DEN_TIPO, DEN_DESCRICAO, DEN_DATA, USU_ID, POS_ID)
         VALUES (:tipo, :descricao, :data, :userId, :idPost)`,
      {
        tipo,
        descricao,
        data: dataAtual,
        userId,
        idPost,
      },
      { autoCommit: true }
    );
    return { success: true, message: "Denúncia registrada com sucesso!" };
  } catch (error) {
    console.error("Erro ao registrar denúncia no modelo:", error);
    throw new Error("Erro interno ao registrar denúncia.");
  } finally {
    if (connection) await connection.close();
  }
}

async function listarUsuariosEDenuncias() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `
          SELECT
              U.USU_ID AS id,
              P.PES_NOME AS PES_NOME,
              U.USU_STATUS AS USU_STATUS,
              U.USU_EMAIL AS USU_EMAIL,
                COALESCE(DenunciasRecebidas.count_denuncias_recebidas, 0) AS denuncias_recebidas_count
          FROM
              USUARIO U
          INNER JOIN
              PESSOA P ON U.PES_ID = P.PES_ID
          LEFT JOIN (
                      SELECT
                          POST.USU_ID AS ID_DO_DONO_DO_POST, 
                          COUNT(DENUNCIAS.DEN_ID) AS count_denuncias_recebidas
                      FROM
                          DENUNCIAS
                      INNER JOIN
                          POST ON DENUNCIAS.POS_ID = POST.POS_ID
                      GROUP BY
                          POST.USU_ID 
                  ) DenunciasRecebidas ON U.USU_ID = DenunciasRecebidas.ID_DO_DONO_DO_POST
                  ORDER BY
                      P.PES_NOME
            `,
      [],
      {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      }
    );

    return result.rows;
  } catch (error) {
    console.error("Erro no modelo ao buscar usuários com denúncias:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function listarDenuncias() {
  let connection
  try {
    connection = await getConnection()
    
    const sql = `
      SELECT
          d.DEN_ID AS DEN_ID,
          d.DEN_TIPO AS DEN_TIPO,         
          d.DEN_DESCRICAO AS DEN_DESCRICAO, 
          d.POS_ID AS POS_ID,            
          p_denunciado.PES_NOME AS NOME_DENUNCIADO,
          p_denunciante.PES_NOME AS NOME_DENUNCIANTE,

          d.DEN_DATA AS DEN_DATA,
          d.USU_ID AS ID_DENUNCIANTE_USUARIO,
          p.USU_ID AS ID_USUARIO_DENUNCIADO
      FROM
          DENUNCIAS d
      JOIN
          POST p ON d.POS_ID = p.POS_ID
      JOIN
          USUARIO u_denunciado ON p.USU_ID = u_denunciado.USU_ID
      JOIN
          PESSOA p_denunciado ON u_denunciado.PES_ID = p_denunciado.PES_ID
      JOIN
          USUARIO u_denunciante ON d.USU_ID = u_denunciante.USU_ID 
      JOIN
          PESSOA p_denunciante ON u_denunciante.PES_ID = p_denunciante.PES_ID
      WHERE
          d.DEN_STATUS = 'aberto'
      ORDER BY
          d.DEN_ID DESC
        `;

const result = await connection.execute(sql, [], { outFormat: OracleDB.OUT_FORMAT_OBJECT });

    return result.rows;
    
  } catch (error) {
    console.error("Erro no modelo ao buscar as denúncias:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function pegarPublicacao(idPost) {
  let connection;
  console.log("entrei pegarPublicacao(idPost) MODEL ->", idPost)
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
          pet.PET_DATA AS "POS_DATA",
          pessoa.PES_NOME AS "PES_NOME",
          usuario.USU_FOTO AS "USU_FOTO"
      FROM POST, PET, USUARIO, PESSOA
      WHERE
          pet.PET_ID = post.PET_ID   AND
          usuario.USU_ID = post.USU_ID AND
          pessoa.PES_ID = usuario.PES_ID AND
          post.POS_ID = :idPost
    `;

    const options = {
      fetchInfo: {
        PET_FOTO: { type: OracleDB.BUFFER },
        USU_FOTO: { type: OracleDB.BUFFER },
      },
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    };

    const result = await connection.execute(      sql,      { idPost: idPost },      options    );

    if (result.rows.length > 0) {
      const row = result.rows[0]
      
      const postDataToSend = {
          POS_ID: row.POS_ID,
          POS_TIPO: row.POS_TIPO,
          PET_NOME: row.PET_NOME,
          PET_DESCRICAO: row.PET_DESCRICAO,
          PET_LOCAL: row.PET_LOCAL,
          PES_NOME: row.PES_NOME,
          POS_DATA: formatarDataParaDDMMYYYY(
            new Date(row.POS_DATA).toISOString().split("T")[0]
          ),
          PET_FOTO: row.PET_FOTO
        ? `data:image/jpeg;base64,${row.PET_FOTO.toString("base64")}`
        : null,
          USU_FOTO: row.USU_FOTO
        ? `data:image/jpeg;base64,${row.USU_FOTO.toString("base64")}`
        : null,
      };

      return postDataToSend

    } else {
      console.error("Erro ao buscar publicação ELSE:", error);
      throw error;
    } 

  } catch (error) {
    console.error("Erro ao buscar publicação CATCH:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function manterPublicacao(idDenuncia) {
  let connection;
  try {
    connection = await getConnection();

    console.log("entrei model, id denuncia -->", idDenuncia);
    

    const up = await connection.execute(
      `UPDATE DENUNCIAS SET DEN_STATUS = 'MANTIDO' WHERE DEN_ID = :idDenuncia`,
      { idDenuncia },
      { autoCommit: false }
    );

    const result = await connection.execute(
      `DELETE FROM DENUNCIAS WHERE DEN_ID = :idDenuncia`,
      { idDenuncia },
      { autoCommit: false }
    );

    await connection.commit();

    if (result.rowsAffected && result.rowsAffected > 0 && up.rowsAffected && up.rowsAffected > 0) {

      console.log("model denuncia mantida com sucesso")
      
      return { success: true, message: "Denúncia mantida e registro deletado com sucesso!" };
    } else {
      console.log("model denuncia mantida com FRACASSSSOOOOO_______")
      return { success: false, message: "Denúncia não encontrada ou já está mantida." };
    }

  } catch (error) {
    console.error("Erro ao manter denúncia:", error);
    throw new Error("Erro interno ao manter denúncia.");
  } finally {
    if (connection) await connection.close();
  }
  
}

async function deletarPublicacaoPorDenuncia(idDenuncia, idPost) {
  let connection;
  try {
    connection = await getConnection();

    console.log("atualizando o status para deletado");
    
    const op1 = await connection.execute(
      `UPDATE DENUNCIAS SET DEN_STATUS = 'DELETADO' WHERE DEN_ID = :idDenuncia`,
      { idDenuncia },
      {  }
    );

    console.log(op1);
    console.log("Atualizado. Status agora é deletado");


    console.log("Iniciando a exclusão do registro DENNCIA");
    
    const op2 = await connection.execute(
      `DELETE FROM DENUNCIAS WHERE DEN_ID = :idDenuncia `,
      { idDenuncia },
      {  }
    );

    console.log(op2);
    console.log("DENUNCIA Excluida com sucesso. Ou seja, não há 'dependencia' apontando para o post");
    console.log("Indo INCREMENTAR");
    
    const sql = `
    UPDATE USUARIO
    SET USU_REPORTS_COUNT = NVL(USU_REPORTS_COUNT, 0) + 1
    WHERE USU_ID = (SELECT USU_ID FROM POST WHERE POS_ID = :postIdParam)
    `;
    const bindParams = { postIdParam: idPost }; 
    
    const result = await connection.execute(sql, bindParams);
    
    if (result.rowsAffected === 0) {
      console.warn(`Aviso: Contador de denúncias não incrementado. Publicação ID ${idPost} não encontrada ou não associada a um usuário existente.`);
      return false;
    }  
    
    console.log("Incremento com SUCESSO", result );

    console.log("Iniciando a exclusão da publicação");
    
    const op3 = await connection.execute(
      `DELETE FROM POST WHERE POS_ID = :idPost`,
      { idPost },
      {  }
    );

    console.log(op3);
    console.log("Exclusão do POST realizada com sucesso!!!!!")  
    await connection.commit();

    return { success: true, message: "Denúncia e publicação deletadas com sucesso!" };
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Erro ao deletar publicação por denúncia:", error);
    throw new Error("Erro interno ao deletar publicação e atualizar denúncia.");
  } finally {
    if (connection) await connection.close();
  }
}

async function deletarDadosDaPublicacao(id) {
  let connection;
  try {
    console.log("Iniciando conexão com o banco...");
    connection = await getConnection();
    console.log("Conexão estabelecida.");

    // Buscar o PET_ID relacionado ao POST
    console.log("Buscando PET_ID relacionado ao POST...");
    const result = await connection.execute(
      `SELECT PET_ID FROM POST WHERE POS_ID = :id`,
      { id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    console.log("Busca de PET_ID finalizada.");

    if (!result.rows.length) {
      console.log("Publicação não encontrada.");
      return { success: false, message: "Publicação não encontrada." };
    }

    const petId = result.rows[0].PET_ID;

        const sql = `
        UPDATE USUARIO
        SET USU_REPORTS_COUNT = NVL(USU_REPORTS_COUNT, 0) + 1
        WHERE USU_ID = (SELECT USU_ID FROM POST WHERE POS_ID = :id)
    `;

    const resultado = await connection.execute(sql, [id]);

    console.log(`Contador de denúncias incrementado para o usuário. Linhas afetadas: ${resultado.rowsAffected}`);

    if (resultado.rowsAffected === 0) {
        const error = new Error('Falha ao deletar a publicação. Pode não existir ou já foi deletada.');
        error.status = 404;
        throw error;
    }

    // Excluir o POST primeiro
    console.log("Excluindo POST...");
    await connection.execute(
      `DELETE FROM POST WHERE POS_ID = :id`,
      { id }
    );
    console.log("POST excluído.");

    // Excluir o PET depois
    console.log("Excluindo PET...");
    await connection.execute(
      `DELETE FROM PET WHERE PET_ID = :petId`,
      { petId }
    );
    console.log("PET excluído.");

    console.log("POST e PET deletados com sucesso");



    
    await connection.commit();

    return { success: true, message: "Dados da publicação excluídos com sucesso!" };
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Erro ao deletar dados da publicação:", error);
    throw new Error("Erro interno ao deletar dados da publicação.");
  } finally {
    if (connection) await connection.close();
  }
}

async function existeUsuario(email, userId) {
  console.log("ENTREI Na MODAL -> existeUsuario")
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT COUNT(*) AS COUNT FROM USUARIO WHERE USU_EMAIL = :email AND USU_ID = :userId`,
      { email, userId },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return result.rows[0].COUNT > 0;
    } catch (error) {
    console.error("Erro ao verificar existência de usuário:", error);
    throw new Error("Erro interno ao verificar usuário.");
    } finally {
    if (connection) await connection.close();
    }
}


// Função para atualizar dados do usuário dinamicamente
// Recebe: userId, objeto com campos a atualizar (ex: { USU_EMAIL: 'novo@email.com', USU_NOME: 'Novo Nome' })
async function realizarAtualizacaoUsuario(userId, nome, email, senha) {
  console.log("Iniciando atualização de usuário:", userId);
  let connection;
  try {
    const validatedData = {};
        if (nome !== undefined && nome !== null) validatedData.nome = nome;
        if (email !== undefined && email !== null) validatedData.email = email;
        if (senha !== undefined && senha !== null) validatedData.senha = senha; // Assumimos que 'senha' já vem hasheada aqui

        // Se nenhum campo foi fornecido para atualização, retorna cedo
        if (Object.keys(validatedData).length === 0) {
            console.log("Nenhum dado fornecido para atualização.");
            return 0; // Nenhuma linha afetada
        }

        connection = await getConnection();
        await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED'); // Inicia a transação
        let rowsAffectedTotal = 0;

        // --- Atualização da tabela USUARIO (email e senha) ---
        const userUpdateFields = [];
        const userBindParams = {};
        let userParamCounter = 1; // Para nomes de parâmetros únicos

        if (validatedData.email !== undefined) {



            const paramName = `email${userParamCounter++}`;
            userUpdateFields.push(`USU_EMAIL = :${paramName}`);
            userBindParams[paramName] = validatedData.email;

            // Opcional: Verificação de unicidade do e-mail (regra de negócio no serviço)
            const checkEmailSql = `SELECT USU_ID FROM USUARIO WHERE USU_EMAIL = :email AND USU_ID != :userId`;
            const existingUser = await connection.execute(checkEmailSql, { email: validatedData.email, userId: userId });
            if (existingUser.rows && existingUser.rows.length > 0) {
                // Lançar um erro mais específico para a camada superior tratar
                const error = new Error('Este e-mail já está em uso por outro usuário.');
                error.status = 409; // Status HTTP para Conflito
                throw error;
            }
        }

        if (validatedData.senha !== undefined) {

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(validatedData.senha, salt);
            
            // passwordHashed = `${senhaHash}`;
            // console.log(senha);
            // console.log(passwordHashed);    

            const paramName = `senha${userParamCounter++}`;
            userUpdateFields.push(`USU_SENHA = :${paramName}`);
            userBindParams[paramName] = senhaHash;
        }

        if (userUpdateFields.length > 0) {
            const userSetClause = userUpdateFields.join(', ');
            const userUpdateSql = `UPDATE USUARIO SET ${userSetClause} WHERE USU_ID = :userIdParam`;
            userBindParams.userIdParam = userId;

            const userResult = await connection.execute(userUpdateSql, userBindParams, { autoCommit: false });
            rowsAffectedTotal += userResult.rowsAffected;
        }

        // --- Atualização da tabela PESSOA (nome) ---
        if (validatedData.nome !== undefined) {
            // Primeiro, obter o FK_PESSOA_ID do usuário
            const getPessoaIdSql = `SELECT PES_ID FROM USUARIO WHERE USU_ID = :userIdParam`;
            const pessoaResult = await connection.execute(getPessoaIdSql, { userIdParam: userId });

            if (pessoaResult.rows.length === 0) {
                const error = new Error('Usuário não encontrado para obter ID da pessoa.');
                error.status = 404;
                throw error;
            }
            const pessoaId = pessoaResult.rows[0][0]; // Extrai o PES_ID

            const pessoaUpdateFields = [];
            const pessoaBindParams = {};
            let pessoaParamCounter = 1; // Para nomes de parâmetros únicos

            const paramName = `nome${pessoaParamCounter++}`;
            pessoaUpdateFields.push(`PES_NOME = :${paramName}`);
            pessoaBindParams[paramName] = validatedData.nome;

            const pessoaSetClause = pessoaUpdateFields.join(', ');
            const pessoaUpdateSql = `UPDATE PESSOA SET ${pessoaSetClause} WHERE PES_ID = :pessoaIdParam`;
            pessoaBindParams.pessoaIdParam = pessoaId;

            const pessoaResult2 = await connection.execute(pessoaUpdateSql, pessoaBindParams, { autoCommit: false });
            rowsAffectedTotal += pessoaResult2.rowsAffected;
        }

        // --- Commitar a transação ---
        await connection.commit();

        // Verificação final se alguma linha foi afetada quando deveria
        if (rowsAffectedTotal === 0 && Object.keys(validatedData).length > 0) {
            const error = new Error('Nenhuma linha foi afetada. Usuário pode não existir ou dados já estão atualizados.');
            error.status = 404; // Ou 200 com mensagem específica se for considerado sucesso sem alteração
            throw error;
        }

        return rowsAffectedTotal;

    //return { success: result.rowsAffected > 0 };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Erro interno ao atualizar usuário.");
  } finally {
    if (connection) await connection.close();
  }
}

async function realizarBanimentoEnviarEmail(email) {
  let connection;
  try {
    connection = await getConnection()

    const mailOptions = {
    from: myEmail,
    to: email,
    subject: "Banimento do site BuscaPet",
    html: `
            <p>Prezado(a) usuário(a),</p>
            <p>Informamos que sua conta foi banida do site BuscaPet devido ao descumprimento de nossas políticas de uso.</p>
            <p>O acesso à sua conta foi bloqueado e você não poderá mais utilizar nossos serviços.</p>
            <p>Atenciosamente,<br>Equipe BuscaPet</p>
          `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email de banimento enviado para ${email}.`);
  const sql = `UPDATE USUARIO SET USU_STATUS = 'B' WHERE USU_EMAIL = :email`;
  const updateResult = await connection.execute(sql, [email], { autoCommit: false });

  if (updateResult.rowsAffected === 0) {
      const error = new Error('Usuário não encontrado ou já estava banido. Status do banco não foi alterado.');
      error.status = 400;
      throw error;
  }

  console.log("EMAIL E BANIMENTO SUCESSO");
  await connection.commit(); // Confirma as mudanças no banco de dados

  return { success: true, message: 'Usuário banido e e-mail enviado com sucesso.' };

  } catch (error) {
    
    if (connection) {
        try {
            await connection.rollback();
        } catch (rbErr) {
            console.error("Erro no rollback da transação:", rbErr);
        }

        console.error("Falha no processo de banimento do usuário:", error);
        throw new Error("Erro interno ao banir usuário e enviar e-mail.");         
    }

  } finally {
    if (connection) await connection.close();
  }
}



export default {
  salvarDenuncia,
  listarUsuariosEDenuncias,
  listarDenuncias,
  pegarPublicacao,
  manterPublicacao,
  deletarPublicacaoPorDenuncia,
  deletarDadosDaPublicacao,
  existeUsuario,
  realizarAtualizacaoUsuario,
  realizarBanimentoEnviarEmail
};
