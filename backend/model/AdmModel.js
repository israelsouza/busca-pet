import OracleDB from "oracledb";
import DBHelper from '../utils/dbHelper.js';
import log from '../utils/logger.js';

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