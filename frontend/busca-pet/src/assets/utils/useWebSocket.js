import { useState, useEffect } from "react";
import obterIdDoUsuarioLogado from './obterIdDoUsuarioLogado.js'

const useWebSocket =  (url) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = async () => {
      console.log("WebSocket conectado.");
      // Enviar ID do usuário para registro no backend (se necessário)
      const userId = await obterIdDoUsuarioLogado();
      //console.log("USERID : --->>> ", userId);
      
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId: userId }));
      }
    };

    ws.onmessage = (event) => {
      try {                       
        console.log("EVENTOOOOOOOOOO: ", event);
        const message = JSON.parse(event.data);                
        setMessages((prevMessages) => [...prevMessages, message]);   
        
        if (message) {
          alert("Olá, parece que alguém viu uma publicação sua, cheque suas notificações e confira!!"); // Converte o objeto inteiro para string
        }
      } catch (error) {
        console.error("Erro ao processar mensagem WebSocket:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado.");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
      setSocket(null);
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };

  return { socket, messages, sendMessage };
};

export default useWebSocket;
