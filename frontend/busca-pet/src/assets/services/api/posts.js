import apiFetch from "../httpClient.js";

/**
 * Buscar publicações textualmente no backend.
 * @param {String} o termo de busca.
 * @returns {Promisse<Array>} Uma promessa que resolve para um array de publicações.
 */
export async function getPublicacoesPorTexto(query) {
    return apiFetch(`/publicacoes/busca?q=${encodeURIComponent(query)}`, {
        method: 'GET'
    })
}

export async function getPetsPorArea(lat, lng) {
    return apiFetch(`/publicacoes/area?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`, {
        method: 'GET'
    })
}

// export async function getMinhasPublicacoes() {
//     return apiFetch(`/api/posts/user`, {
//         method: 'GET'
//     })
// }