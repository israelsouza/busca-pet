import app from "./app.js";
import http from "http";
import { setupWebSocket } from "./utils/websocket.js";

const server = http.createServer(app);
setupWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP e WebSocket rodando na porta ${PORT}`);
});
