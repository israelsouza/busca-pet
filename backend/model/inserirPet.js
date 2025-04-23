import OracleDB from "oracledb";
import fs from "fs";

function formatarDataParaDDMMYYYY(data) {
  const [ano, mes, dia] = data.split("-"); // Supondo que a data recebida seja no formato YYYY-MM-DD
  return `${dia}-${mes}-${ano}`;
}

async function inserirPet(connection, dadosPet) {
  try {
    const imagemBinaria = fs.readFileSync(dadosPet.imagem);
    console.log("Tamanho da imagem:", imagemBinaria.length);
    const dataFormatada = formatarDataParaDDMMYYYY(dadosPet.data);

    const result = await connection.execute(
      `INSERT INTO PET (PET_NOME, PET_RGA, PET_TIPO, PET_DESCRICAO, PET_DATA, PET_FOTO)
       VALUES (:nome, :rga, :tipo, :descricao, TO_DATE(:data, 'DD-MM-YYYY'), :imagem)
       RETURNING PET_ID INTO :id`,
      {
        nome: dadosPet.nome,
        rga: dadosPet.rga,
        tipo: dadosPet.tipo,
        descricao: dadosPet.descricao,
        data: dataFormatada,
        imagem: imagemBinaria,
        id: { dir: OracleDB.BIND_OUT }, // Retorna o ID gerado
      }
    );

    // fs.unlinkSync(dadosPet.imagem);
    // console.log("Arquivo de imagem deletado com sucesso!");
    // try {
    //     fs.unlinkSync(dadosPet.imagem);
    //     console.log("Arquivo de imagem deletado com sucesso!");
    // } catch (err) {
    //     console.error("Erro ao deletar o arquivo de imagem:", err);
    // }

    

    // Retorna o ID do pet inserido
    return result.outBinds.id[0];
  } catch (error) {
    console.error("Erro ao inserir pet no banco de dados:", error);
    throw error;
  }
}

export default inserirPet;