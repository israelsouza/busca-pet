async function enviarDados(data, url, method = 'POST', token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Erro na requisição');
        }

        return { success: true, ...responseData }; 
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        return { success: false, message: error.message }; 
    }
}

export default enviarDados;