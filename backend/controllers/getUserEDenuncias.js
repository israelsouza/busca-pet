// import UsuarioModel from "../model/getUserId.js";

async function getUsuarios(req, res) {
  try {
    //const usuarios = await UsuarioModel.getUsersEDenuncias();
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários", error: error.message });
  }
}

export default getUsuarios;
