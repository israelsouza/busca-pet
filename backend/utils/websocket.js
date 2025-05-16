import { WebSocketServer } from "ws";

const clients = new Map();
let wss;

const setupWebSocket = (server) => {
  wss = new WebSocketServer(server);

  wss.on("connection", (ws, request) => {
    const userId = extractIdUser(request);
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
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
    return true;
  }
  return false;
};

export { setupWebSocket, registerClient, sendMessageToUser };
