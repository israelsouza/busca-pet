import { WebSocketServer } from "ws";
import authenticateWebSocket from './authenticateWebSocket.js'

const clients = new Map();
let wss;

const setupWebSocket = (server) => {
  wss = new WebSocketServer({server});

  wss.on("connection", async (ws, request) => {
    const userId = await authenticateWebSocket(request);
    if (userId) {
      console.log(`Cliente conectado com ID: ${userId}`);
      clients.set(userId, ws);

      ws.on("message", (message) => {
        console.log(
          `Mensagem recebida do usuário ${userId}: ${message.toString()}`
        );
      });

      ws.on("close", () => {
        console.log(`Cliente desconectado com ID: ${userId}`);
        clients.delete(userId);
      });

      ws.on("error", (error) => {
        console.error(`Erro no WebSocket do usuário ${userId}:`, error);
        clients.delete(userId);
      });

      ws.send("Conexão WebSocket estabelecida!");
    } else {
      console.log("Conexão WebSocket sem ID de usuário.");
      ws.close();
    }
  });

  console.log("Servidor WebSocket configurado.");
};

const registerClient = (userId, ws) => {
  clients.set(userId, ws);
  console.log(`Cliente registrado com ID: ${userId}`);
};

const sendMessageToUser = (userId, message) => {
  console.log("MESSAGE DENTRO DA FUNçÂO ---> ",message);
  
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
    return true;
  }
  return false;
};

const notifyAdmins = (mensagem) => {
  for (const [userId, ws] of clients.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      // Aqui você pode adicionar lógica para verificar se o userId é admin (consultar no banco, cache, etc)
      ws.send(JSON.stringify({ tipo: "nova_denuncia", conteudo: mensagem }));
    }
  }
}

export { setupWebSocket, registerClient, sendMessageToUser, notifyAdmins};
