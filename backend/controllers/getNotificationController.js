import {getUserIdByEmail} from "../model/getUserId.js";
import extrairEmailDoToken from "../utils/extrairEmailDoToken.js";
import getNotificationModel from "../model/getNotificationModel.js";
import deleteNotificationModel from "../model/deleteNotificationModel.js";

async function getNotificationController(req, res) {
 console.log("ENTREEEEIII");
 
  try {
    const { token } = req.params;

    console.log("NOT-CONT-NOTIF --->", token);
    

    const email = await extrairEmailDoToken(token);

    const id = await getUserIdByEmail(email);

    console.log("ID NA MODEL ---->", id);
    

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

async function deleteNotificationController(req, res) {
  const { id } = req.params;

  try {
    await deleteNotificationModel(id);    
    return res.status(200).json({message: "Notificação deletada!" })
  } catch (e) {
    console.error(e);
    return res.status(500).json({message: "Erro ao tentar deletar a notificação." })
  }
}

export { getNotificationController, deleteNotificationController};
