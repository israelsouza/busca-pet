function EmailFromToken() {
  const token = localStorage.getItem("authToken");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do token
    return payload.email; // Obtém o email do payload
  } else {
    console.log("Token não encontrado.");
    return false;
  }
}

export default EmailFromToken;
