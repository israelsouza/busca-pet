import { useState, useEffect } from "react";

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket conectado.");
      // Enviar ID do usuário para registro no backend (se necessário)
      const userId = obterIdDoUsuarioLogado();
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId: userId }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
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
