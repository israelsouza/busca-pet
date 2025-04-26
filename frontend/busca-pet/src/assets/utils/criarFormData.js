function criarFormData(dados, arquivoImagem) {
  const formData = new FormData();

  // Adiciona os dados do formulário
  formData.append("nome", dados.nome);
  formData.append("rga", dados.rga);
  formData.append("tipoPet", dados.tipoPet);
  formData.append("descricao", dados.descricao);
  formData.append("data", dados.data);

  // Adiciona a imagem como arquivo
  if (arquivoImagem) {
    formData.append("imagem", arquivoImagem); // Adiciona o arquivo diretamente
  }

  return formData;
}

export default criarFormData;