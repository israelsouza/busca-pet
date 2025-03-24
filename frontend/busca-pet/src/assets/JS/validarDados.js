function validarDados() {
    let nome = document.getElementById(nome);
    let rga = document.getElementById(rga);
    let descricao = document.getElementById(descricao);
    let data = document.getElementById(data);

    if (nome == "" || descricao == "" || data == "") {
        alert("Preencha os campos obrigatórios");
        return false;
    }

    const informacaoPetPerdido = [nome, rga, descricao, data]
}