import express from "express";
import cors from "cors";
import cadastroUsuario from "./routes/cadastroUsuario.js";
import logarUsuario from "./routes/logarUsuario.js";
import autenticarToken from "./middleware/authMiddleware.js";
import validateToken from "./routes/validateToken.js";
import cadastrarPetPerdido from "./routes/cadastrarPetPerdido.js";
import cadastrarPetEncontrado from './routes/petEncontrado.js'
import recuperarSenha from "./routes/recuperarSenha.js";
import validarTokenSenha from "./routes/validarTokenSenha.js";
import atualizarSenha from "./routes/atualizarSenha.js";
import buscarUsuario from "./routes/editPerfilUsuario.js";
import postRoutes from './routes/post.js'

const app = express();
app.use(cors());
app.use(express.json());

// middleware
app.use("/validate-token", validateToken);

// rotas publicas
app.use("/form/cadastro-usuario", cadastroUsuario);
app.use("/form/login", logarUsuario);
app.use("/form/recuperar-senha", recuperarSenha);
app.use("/validar-token-senha", validarTokenSenha);
app.use("/atualizar-senha", atualizarSenha);


// rotas privadas (protegidas)
app.use("/usuarios", autenticarToken, buscarUsuario);
app.use("/criar-post/pet-perdido", autenticarToken, cadastrarPetPerdido);
app.use("/criar-post/pet-encontrado", autenticarToken, cadastrarPetEncontrado);
app.use("/api/posts", autenticarToken, postRoutes);

export default app;
