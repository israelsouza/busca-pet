import app from "./app.js";
const PORT = 3000;

// responsavel apenas pela inicialização do servidor
app.listen(PORT, () => {
  console.log("Servidor escutando na porta 3000");
});
