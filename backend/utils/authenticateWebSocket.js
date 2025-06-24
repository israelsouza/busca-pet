import TokenService from "../service/TokenService.js";

const authenticateWebSocket = async (request) => {
  try {
    const url = new URL(request.url, `ws://${request.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      console.log("WebSocket connection without token.");
      return null;
    }

    const decoded = await TokenService.extrairIdDoToken(token);

    return decoded;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default authenticateWebSocket;
