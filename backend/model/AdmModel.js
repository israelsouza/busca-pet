import bcrypt from 'bcrypt'
import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import DBHelper from '../utils/dbHelper.js';

export async function deletarDadosDaPublicacao(id) {
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

class AdmModel {
  
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

  async listarDenuncias(){
    return DBHelper.withConnection({ module: "AdmModel", methodName: "listarDenuncias" }, async (connection) => {
      const denuncias = await connection.execute(`
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
      `,[],{  outFormat: OracleDB.OUT_FORMAT_OBJECT  })

      return denuncias.rows;
    })
  }

  async listaPostDenunciado(id){
    return DBHelper.withConnection({ module: 'AdmModel', methodName: 'listaPostDenunciado'}, async (connection) => {
      const { rows } = await connection.execute(`
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
        `, [id],
        {
          fetchInfo: {
            PET_FOTO: { type: OracleDB.BUFFER },
            USU_FOTO: { type: OracleDB.BUFFER },
          },
          outFormat: OracleDB.OUT_FORMAT_OBJECT
        }
      )

      return rows;
    })
  }

  async manterPost(idDenuncia){
    return DBHelper.withTransaction({ module: 'AdmModel', methodName: 'manterPost'}, async (connection) => {
      await connection.execute(
        `UPDATE DENUNCIAS SET DEN_STATUS = 'MANTIDO' WHERE DEN_ID = :idDenuncia`, [idDenuncia]
      )

      console.log("status da denuncia alterado para mantido");

      await connection.execute(
        `DELETE FROM DENUNCIAS WHERE DEN_ID = :idDenuncia`, [idDenuncia]
      )

      console.log("denuncia deletada com sucesso");

      return { success: true, message: "Denúncia mantida e registro deletado com sucesso!" };
      
    })
  }

  async deletarPost(post, denuncia) {
    return DBHelper.withTransaction({ module: 'AdmModel', methodName: 'deletarPost'}, async (connection) => {
      await connection.execute(
        `UPDATE DENUNCIAS SET DEN_STATUS = 'DELETADO' WHERE DEN_ID = :denuncia`, [denuncia]
      );

      await connection.execute(
        `DELETE FROM DENUNCIAS WHERE DEN_ID = :denuncia`, [denuncia]
      );

      const result = await connection.execute(
        `
          UPDATE USUARIO
          SET USU_REPORTS_COUNT = NVL(USU_REPORTS_COUNT, 0) + 1
          WHERE USU_ID = (SELECT USU_ID FROM POST WHERE POS_ID = :post)
        `, [post]
      );

      if (result.rowsAffected === 0) {
        throw new Error(`Aviso: Contador de denúncias não incrementado. Publicação ID ${post} não encontrada ou não associada a um usuário existente.`);
      }

      console.log(" Denuncia atualizada. Contador incrementado com sucesso");
      
      await connection.execute( ` DELETE FROM POST WHERE POS_ID = :id `, [post] )

      return { success: true, message: "Denúncia e publicação deletadas com sucesso!" };
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
  
  async atualizarUsuario(id, dadosPreenchidos){
    return DBHelper.withTransaction({ module: "AdmModel", methodName: "atualizarUsuario" }, async (connection) => {

      const chavesDosCampos = Object.keys(dadosPreenchidos)
      if (chavesDosCampos.length === 0) return 0;

      const mapeamentoColunas = {
          email: { tabela: 'USUARIO', coluna: 'USU_EMAIL' },
          senha: { tabela: 'USUARIO', coluna: 'USU_SENHA' },
          nome: { tabela: 'PESSOA', coluna: 'PES_NOME' }
      };

      const atualizacoes = {
        USUARIO: { clausulas: [], parametros: { id: id } },
        PESSOA: { clausulas: [], parametros: { id: id } }
      }    

      for (const campo of chavesDosCampos) {
        const mapeamento = mapeamentoColunas[campo];
        if ( mapeamento ){
          const { tabela, coluna } = mapeamento;
          atualizacoes[tabela].clausulas.push(`${coluna} = :${campo}`);
          atualizacoes[tabela].parametros[campo] = dadosPreenchidos[campo];
        }
      }

      let totalRowsAffected = 0;

      if ( atualizacoes.USUARIO.clausulas.length > 0 ) {
        const sql = `
          UPDATE USUARIO
          SET ${atualizacoes.USUARIO.clausulas.join(', ')}
          WHERE USU_ID = :id
        `

        const result = await connection.execute(sql, atualizacoes.USUARIO.parametros);
        totalRowsAffected += result.rowsAffected;
      }

      if ( atualizacoes.PESSOA.clausulas.length > 0 ) {
        const sql = `
          UPDATE PESSOA
          SET ${atualizacoes.PESSOA.clausulas.join(', ')}
          WHERE PES_ID = (SELECT PES_ID FROM USUARIO WHERE USU_ID = :id)
        `

        await connection.execute(sql, atualizacoes.PESSOA.parametros);
      }

      if (totalRowsAffected === 0 && atualizacoes.PESSOA.clausulas.length === 0) {
        throw new Error("Usuario não encontrado ou nenhum dado a ser atualizado.");
      }

      return 1;

    })
  }
}


export default new AdmModel();