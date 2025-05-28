const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Função utilitária para fazer requisições HTTP autenticadas.
 * Adiciona automaticamente o token de autenticação e cabeçalhos padrão.
 * @param {string} endpoint O caminho da URL da API (ex: '/publicacoes/busca').
 * @param {Object} options As opções padrão do fetch (method, body, etc.).
 * @returns {Promise<any>} A promessa da resposta da requisição.
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição para ${endpoint}: ${response.status} ${response.statusText}`;
    let errorData = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorMessage; // Usa a mensagem do backend se existir
    } catch (e) {
      console.warn('Erro ao parsear resposta de erro como JSON:', e);
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text().then(text => text ? JSON.parse(text) : {});
}

export default apiFetch;