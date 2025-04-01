import express from "express";
// import inserirUsuarioBD from "../model/cadastrarUsuario.js";

// metodo para que o express possua o poder de gerenciar as requisoes HTTP
const router = express.Router();

router.post("/", (request, response) => {
  
  const dados = request.body; // armazena os valores do formulario
  response.status(200).json({ message: "Mensagem vinda do Backend: Dados enviados com sucesso" }); // responde que valores chegaram com sucesso [TODO NO FRONT]

  // verificar valores
  console.log("Dados recebidos no backend ---> ", dados);
  // chamar metodo que vai inserir valores no banco de dados
});


// semelhante ao retorno dentro de uma função
// ao chamar o arquivo 'cadastroUsuario.js' o valor dele ser essa exportação
export default router;
