/**
 * Registra uma mensagem de log estruturada no console.
 * 
 * @param {string} level - O nível do log. Exemplos: 'INFO', 'ERROR', 'DEBUG', 'WARN'.
 * @param {string} module - O módulo ou componente onde o log se originou. Exemplos: 'USER_CONTROLLER', 'AUTH_SERVICE', 'DATABASE_MODEL'.
 * @param {string} action - A ação específica ou método que está sendo logado. Exemplos: 'cadastrarUsuario', 'loginAttempt', 'fetchProductDetails'.
 * @param {string} message - A mensagem descritiva do log. Exemplos: 'Operação iniciada', 'Dados recebidos com sucesso', 'Falha na validação', 'Usuário autenticado'.
 * @param {object} [data=null] - Um objeto opcional contendo dados adicionais relevantes para o log. Exemplo: `{ userId: 123, requestBody: {...}, errorDetails: '...' }`.
 * @returns {void} - Esta função não retorna nenhum valor.
 * 
 * @example
 * // Log de informação sobre o início de uma operação em um controller
 * log('INFO', 'UserController', 'getUserById', 'Busca de usuário iniciada', { userId: req.params.id });
 * 
 * @example
 * // Log de erro durante o processamento de um pagamento
 * try {
 *   // ... lógica de pagamento ...
 * } catch (error) {
 *   log('ERROR', 'PaymentService', 'processPayment', 'Falha ao processar pagamento', { orderId: order.id, error: error.message, stack: error.stack });
 * }
 * 
 * @example
 * // Log de debug com dados de uma requisição
 * log('DEBUG', 'ProductController', 'updateProduct', 'Dados recebidos para atualização', { productId: req.params.id, body: req.body });
 */
function log(level, module, action, message, data = null) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const logData = data ? ` - Data: ${JSON.stringify(data)}` : '';
    console.log(`[${timestamp}] [${level}] [${module}] ${action} - ${message}${logData}`);
}

export default log;