import { WebSocketServer } from "ws";
import authenticateWebSocket from './authenticateWebSocket.js'
import log from "./logger.js";

class SocketService {
  constructor(){
    this.wss = null;
    this.clients = new Map();
  }

  inicializandoWebSocket(server){
    this.wss = new WebSocketServer({server});

    this.wss.on("connection", this._onConnection.bind(this));

    log('WS', 'WebSocket', 'inicializandoWebSocket', `Servidor WebSocket configurado.`);
  }

  async _onConnection(ws, request) {
      const userPayload = await authenticateWebSocket(request);
      if (userPayload && userPayload.id) {
        log('WS', 'WebSocket', 'inicializandoWebSocket', `Cliente com ID: ${userPayload.id} ONLINE`)
        this.clients.set(userPayload.id, {
          ws: ws,
          role: userPayload.role
        });

        ws.on("message", (message) => {
          log('WS', 'WebSocket', 'inicializandoWebSocket', `Mensagem recebida do usuário ${userPayload.id}: ${message.toString()}`);
        });

        ws.on("close", () => {
          log('WS', 'WebSocket', 'inicializandoWebSocket', `Cliente com ID: ${userPayload.id} OFFLINE`)
          this.clients.delete(userPayload.id);
        });

        ws.on("error", (error) => {
          log('WS', 'WebSocket', 'inicializandoWebSocket', `Erro no WebSocket do usuário ${userPayload.id}: ${error.message}`);
          this.clients.delete(userPayload.id);
        });

        ws.send("Conexão WebSocket estabelecida!");
        log('WS', 'WebSocket', 'inicializandoWebSocket', `Conexão WebSocket estabelecida.`);
      } else {
        log('WS', 'WebSocket', 'inicializandoWebSocket', `Conexão WebSocket falhou: ID de usuário inválido.`);
        ws.send("Conexão WebSocket falhou: ID de usuário inválido.");
        ws.close();
      }
  }

  notifyAdmins(mensagem){
    const mensagemString = JSON.stringify({ tipo: "nova_denuncia", conteudo: mensagem });
    for (const clientData of this.clients.values()) {
      if (clientData.role === 'ADM' && clientData.ws.readyState === WebSocket.OPEN) {
        log('WS', 'WebSocketManager', 'notifyAdmins', `Notificando ADM - Mensagem: ${mensagemString}`);
        clientData.ws.send(mensagemString);
      }
    }
  }

  sendMessageToUser (userId, message)  {
    log('WS', 'WebSocket', 'sendMessageToUser', `Notificar o usuário referente a um pet --  ${message}`);
    
    const clientData = this.clients.get(userId);
    if (clientData && clientData.ws.readyState === WebSocket.OPEN) {
      clientData.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

}

export default new SocketService();
