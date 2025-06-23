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
      const userId = await obterIdDoUsuarioLogado();
      
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId: userId }));
      }
    };

    ws.onmessage = (event) => {
      try {                       
        const dados = JSON.parse(event.data)
        const message = JSON.parse(event.data);                
        setMessages((prevMessages) => [...prevMessages, message]);  
        
        if (dados.tipo === 'nova_denuncia') {
          alert("[ WebSocket ] - Denuncia enviada aos administradores.")
        } else {
          alert("Olá, parece que alguém viu uma publicação sua, cheque suas notificações e confira!!");
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
