import getUserIdByEmail from "../model/getUserId.js";
import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";
import getNotificationModel from "../model/getNotificationModel.js";

async function getNotificationController(req, res) {
  try {
    const { token } = req.params;

    const email = await extrairEmailDoToken(token);

    const id = await getUserIdByEmail(email);

    const result = await getNotificationModel(id);

    return res.status(200).json({
      message: "Dados capturados e enviados.",
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao capturar notificações, tente novamente"
    });
  }

  // ver se tem alguma notificação relacionada com esse id
  // retornar se tiver
}

export default getNotificationController;
