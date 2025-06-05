function obterIdDoUsuarioLogado() {
    const token = localStorage.getItem("authToken");
    //console.log("OBTER ID -> ", token);
    
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const id = Object.values(payload)[0];
        //console.log("ID DO USUARIO: ", id)
        return id;
    } catch (e) {
        return null;
    }
}

export default obterIdDoUsuarioLogado;