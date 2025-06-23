function obterIdDoUsuarioLogado() {
    const token = localStorage.getItem("authToken");

    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const id = Object.values(payload)[0];
        return id;
    } catch (e) {
        return null;
    }
}

export default obterIdDoUsuarioLogado;