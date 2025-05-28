import apiFetch from "../httpClient.js";

/**
 * Buscar publicações textualmente no backend.
 * @param {String} o termo de busca.
 * @returns {Promisse<Array>} Uma promessa que resolve para um array de publicações.
 */
export async function buscarPublicacoesPorTexto(query) {
    return apiFetch(`/publicacoes/busca?q=${encodeURIComponent(query)}`, {
        method: 'GET'
    })
}
