import express from "express";
import cors from "cors";
import cadastroUsuario from "./routes/cadastroUsuario.js";
import logarUsuario from "./routes/logarUsuario.js";
import getTodosPosts from "./routes/getTodosPosts.js";
import autenticarToken from "./middleware/authMiddleware.js";
import validateToken from "./routes/validateToken.js";
import cadastrarPetPerdido from './routes/cadastrarPetPerdido.js'

const app = express();
app.use(cors());
app.use(express.json());

// app vai usar as rotas definidas abaixo
// as rotas vao conter todo fluxo de execução, podendo realizar chamadas de outras funções (model)

// rotas publicas
app.use("/form/cadastro-usuario", cadastroUsuario);
app.use("/form/login", logarUsuario);
app.use("/form/recuperer-senha", )


// rota de verificação do token
app.use("/validate-token", validateToken);

// rotas privadas (protegidas)
// app.use("/posts/all", autenticarToken, getTodosPosts);
app.use("/criar-post/pet-perdido", autenticarToken, cadastrarPetPerdido)

export default app;
