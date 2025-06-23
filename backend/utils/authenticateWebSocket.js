import extrairIdDoToken from "./extrairEmailDoToken.js";

const authenticateWebSocket = async (request) => {
  try {
    const url = new URL(request.url, `ws://${request.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      console.log("WebSocket connection without token.");
      return null;
    }

    return await extrairIdDoToken(token);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default authenticateWebSocket;
