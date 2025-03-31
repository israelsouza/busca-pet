import express from "express";
import cors from "cors";
import cadastroUsuario from "./routes/cadastroUsuario.js";

const app = express();
app.use(cors());

// app vai usar as rotas definidas abaixo
// as rotas vao conter todo fluxo de execução, podendo realizar chamadas de outras funções (model)
app.use("/form/cadastro-usuario", cadastroUsuario);


export default app;
