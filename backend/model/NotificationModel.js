import log from '../utils/logger.js'
import getConnection from "./connectionOracle.js";
import OracleDB from "oracledb";
import DBHelper from '../utils/dbHelper.js';

class NotificationModel{
    async listarNotificacoes(id){
        log('INFO', "NotificationModel", 'listarNotificacoes', 'INICIO');
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
            
            log('INFO', "NotificationModel", 'listarNotificacoes', 'FIM bem sucedido');
            return rows;
            
        } catch (error) {
            log('ERROR', "NotificationModel", 'listarNotificacoes', 'Erro ao listar as notificações', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', "NotificationModel", 'listarNotificacoes', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', "NotificationModel", 'listarNotificacoes', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', "NotificationModel", 'listarNotificacoes', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async deletarNotificacao(idNot, idUser){
        log('INFO', "NotificationModel", 'deletarNotificacao', 'INICIO');
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

            log('INFO', "NotificationModel", 'deletarNotificacao', 'FIM bem sucedido');
            return result.rowsAffected > 0;

        } catch (error) {
            log('ERROR', "NotificationModel", 'deletarNotificacao', 'Erro ao deletar a notificação', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', "NotificationModel", 'deletarNotificacao', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', "NotificationModel", 'deletarNotificacao', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', "NotificationModel", 'deletarNotificacao', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async salvarNotificacao(dados){
        log('INFO', "NotificationModel", 'salvarNotificacao', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            await connection.execute(
                `
                    INSERT INTO NOTIFICACOES (NOT_REMETENTE_ID, NOT_DESTINATARIO_ID, NOT_CONTEUDO)
                    VALUES (:remetente, :destinatario, :conteudo)
                `,
                {
                    remetente: dados.remetente,
                    destinatario: dados.destinatario,
                    conteudo: dados.conteudo
                },
                { autoCommit: true }
            );

            log('INFO', "NotificationModel", 'salvarNotificacao', 'FIM bem sucedido');

        } catch (error) {
            log('ERROR', "NotificationModel", 'salvarNotificacao', 'Erro ao salvar a notificação', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', "NotificationModel", 'salvarNotificacao', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', "NotificationModel", 'salvarNotificacao', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', "NotificationModel", 'salvarNotificacao', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async salvarUmaDenuncia(idUsuario, idPost, descricao, tipo, data){
        log('INFO', "NotificationModel", 'salvarUmaDenuncia', 'INICIO');
        let connection;
        try {
            connection = await getConnection();

            await connection.execute(
            `
                INSERT INTO DENUNCIAS (DEN_TIPO, DEN_DESCRICAO, DEN_DATA, USU_ID, POS_ID)
                VALUES (:tipo, :descricao, :data, :userId, :idPost)
            `,
            {
                tipo,
                descricao,
                data,
                userId: idUsuario,
                idPost,
            },
            { autoCommit: true }
            );

            log('INFO', "NotificationModel", 'salvarUmaDenuncia', 'FIM bem sucedido');

            return { success: true, message: "Denúncia registrada com sucesso!" };

        } catch (error) {
            log('ERROR', "NotificationModel", 'salvarUmaDenuncia', 'Erro ao salvar a denúncia', { error });
            console.log(error);
            throw error;
        } finally {
            if (connection) {
            try {
                log('INFO', "NotificationModel", 'salvarUmaDenuncia', 'ENCERRANDO CONEXÃO COM BANCO');
                await connection.close();
                log('INFO', "NotificationModel", 'salvarUmaDenuncia', 'CONEXÃO ENCERRADA');
            } catch (error) {
                log('ERROR', "NotificationModel", 'salvarUmaDenuncia', 'ERRO AO ENCERRAR A CONEXÃO', { error });
            }
            }
        }
    }

    async listarDenuncias(){
        return DBHelper.withConnection({ module: "NotificationModel", methodName: "listarDenuncias" }, async (connection) => {
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
        return DBHelper.withConnection({ module: "NotificationModel", methodName: 'listaPostDenunciado'}, async (connection) => {
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
    return DBHelper.withTransaction({ module: "NotificationModel", methodName: 'manterPost'}, async (connection) => {
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

  async deletarPostPorDenuncia(post, denuncia) {
    return DBHelper.withTransaction({ module: "NotificationModel", methodName: 'deletarPostPorDenuncia'}, async (connection) => {
      await connection.execute(
        `UPDATE DENUNCIAS SET DEN_STATUS = 'DELETADO' WHERE DEN_ID = :denuncia`, [denuncia]
      );

      await connection.execute(
        `DELETE FROM DENUNCIAS WHERE DEN_ID = :denuncia`, [denuncia]
      );

    await connection.execute(
      `DELETE FROM DENUNCIAS WHERE POS_ID = :post`,
      [post]
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

      log('INFO', "NotificationModel", 'deletarPostPorDenuncia', 'Excluindo publicação e PET associados...');

      await connection.execute( `DELETE FROM POST WHERE POS_ID = :id`, [post] )

      log('INFO', "NotificationModel", 'deletarPostPorDenuncia', 'Publicação deletada com sucesso');

       await connection.execute(
            `DELETE FROM PET WHERE PET_ID = (SELECT PET_ID FROM POST WHERE POS_ID = :post)`, [post]
        );

        log('INFO', "NotificationModel", 'deletarPostPorDenuncia', 'PET deletado com sucesso');

      return { success: true, message: "Denúncia e publicação deletadas com sucesso!" };
    })
  }    
}

export default new NotificationModel();