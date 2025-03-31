import express from "express";
// import inserirUsuarioBD from "../model/cadastrarUsuario.js";

// metodo para que o express possua o poder de gerenciar as requisoes HTTP
const router = express.Router();

router.post("/", (request, response) => {
  // importar função que armazena os valores do formulario
  const dados = request.body;
  // verificar valores
  console.log("recebido")
  // chamar metodo que vai inserir valores no banco de dados
});


// semelhante ao retorno dentro de uma função
// ao chamar o arquivo 'cadastroUsuario.js' o valor dele ser essa exportação
export default router;
