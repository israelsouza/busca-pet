function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return null;
  }
}

function validateAdmin() {
  const token = localStorage.getItem("authToken");

  if (!token) { return false; }

  const payload = decodeJwtPayload(token);

  if (!payload) { return false; }

  return payload.role === 'ADM' && payload.status === 'A';
}

export default validateAdmin;
