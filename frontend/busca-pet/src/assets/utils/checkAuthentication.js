import { validateToken } from "./validateToken";

export async function checkAuthentication(navigate) {
  try {
    await validateToken();
  } catch (error) {
    console.error("Erro capturado:", error.message);
    alert(error.message); 
    localStorage.removeItem("authToken"); 
    navigate("/form/login");
  }
}
