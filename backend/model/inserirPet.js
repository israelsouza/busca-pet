import OracleDB from "oracledb";
import fs from "fs";

function formatarDataParaDDMMYYYY(data) {
  const [ano, mes, dia] = data.split("-"); // Supondo que a data recebida seja no formato YYYY-MM-DD
  return `${dia}-${mes}-${ano}`;
}

async function inserirPet(connection, dadosPet, idUsuario) {
  try {
    const imagemBinaria = fs.readFileSync(dadosPet.imagem);
    console.log("Tamanho da imagem:", imagemBinaria.length);
    const dataFormatada = formatarDataParaDDMMYYYY(dadosPet.data);

    const result = await connection.execute(
      `INSERT INTO PET (PET_NOME, PET_RGA, PET_TIPO, PET_DESCRICAO, PET_DATA, PET_FOTO, PET_LOCAL)
       VALUES (:nome, :rga, :tipo, :descricao, TO_DATE(:data, 'DD-MM-YYYY'), :imagem, :local)
       RETURNING PET_ID INTO :id`,
      {
        nome: dadosPet.nome,
        rga: dadosPet.rga,
        tipo: dadosPet.tipo,
        descricao: dadosPet.descricao,
        data: dataFormatada,
        imagem: imagemBinaria,
        local: dadosPet.local,
        id: { dir: OracleDB.BIND_OUT }, // Retorna o ID gerado
      }
    );

    // fs.unlinkSync(dadosPet.imagem);
    // console.log("Arquivo de imagem deletado com sucesso!");

    try {
        fs.unlinkSync(dadosPet.imagem);
        console.log("Arquivo de imagem deletado com sucesso!");
    } catch (err) {
        console.error("Erro ao deletar o arquivo de imagem:", err);
    }

    const petId = result.outBinds.id[0];

    console.log("Id User: ", dadosPet.idUser)

    const resultPost = await connection.execute(
      `INSERT INTO POST (POS_TIPO, POS_DATA, PET_ID, USU_ID)
       VALUES (:tipo, SYSDATE, :idPet, :idUsuario)
       RETURNING POS_ID INTO :id`,
      {
        tipo: "Perdido", // Tipo fixo para esta função
        idPet: petId,
        idUsuario: dadosPet.idUser,
        id: { dir: OracleDB.BIND_OUT }, // Retorna o ID gerado
      }
    );

    const postId = resultPost.outBinds.id[0];
    console.log("Post inserido com sucesso");

    return { petId, postId };
  } catch (error) {
    console.error("Erro ao inserir pet no banco de dados:", error);
    throw error;
  }
}

export default inserirPet;