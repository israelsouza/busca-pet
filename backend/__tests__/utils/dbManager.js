import OracleDB from "oracledb";
import dbConfig from '../../configs/dbConfig.js';

let pool;
let connectionCount = 0;

/**
 * Inicia o pool de conexões se ainda não estiver ativo.
 * Mantém um contador de "suites de teste" ativas.
 */
export async function setupDatabase() {
  if (!pool) {
    try {
      pool = await OracleDB.createPool(dbConfig);
      console.log('Pool de conexões com o Oracle DB iniciado para os testes.');
    } catch (err) {
      console.error('Erro ao iniciar o pool de conexões:', err);
      process.exit();
    }
  }
  connectionCount++;
}

/**
 * Fecha o pool de conexões somente quando a última suite de teste terminar.
 */
export async function teardownDatabase() {
  connectionCount--;
  if (connectionCount === 0 && pool) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await pool.close(10);
      pool = undefined; 
      console.log('Pool de conexões com o Oracle DB fechado.');
    } catch (err) {
      if (err.code !== 'NJS-047') {
        console.error('Erro ao fechar o pool de conexões:', err);
      }
    }
  }
}