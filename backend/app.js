import express from "express";
import cors from "cors";
import cadastroUsuario from "./routes/cadastroUsuario.js";

const app = express();
app.use(cors());

// app vai usar as rotas definidas abaixo
// as rotas vao conter todo fluxo de execução, podendo realizar chamadas de outras funções (model)
app.use("/form/cadastro-usuario", cadastroUsuario);
app.use("/form/login", cadastroUsuario);
app.use("/form/recuperacao-senha", cadastroUsuario);
app.use("/form/cadastro-pet/perdido", cadastroUsuario);
app.use("/form/cadastro-pet/encontrado", cadastroUsuario);

app.use("/publicacao/todos", cadastroUsuario);
app.use("/publicacao/perdido", cadastroUsuario);
app.use("/publicacao/encontrado", cadastroUsuario);
app.use("/publicacao/que-eu-fiz", cadastroUsuario);

export default app;
