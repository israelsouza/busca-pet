import app from "./app.js";
import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente connectado com o WebSocket!");

  ws.on("message", (message) => {
    console.log("Mensagem recebida: ", message.toString());
  });

  ws.on("close", () => {
    console.log("Cliente desconectado do WebSocket");
  });

  ws.on("error", (error) => {
    console.error("Erro no WebSocket: ", error);
  });

  ws.send("Bem-vindo ao servidor WebSocket!");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP e WebSocket rodando na porta ${PORT}`);
});
