import express from "express";
import cors from "cors";

import autenticarToken from "./middleware/authMiddleware.js";
import validateToken from "./routes/validateToken.js";
import cadastrarPetPerdido from "./routes/cadastrarPetPerdido.js";
import cadastrarPetEncontrado from './routes/petEncontrado.js'
import recuperarSenha from "./routes/recuperarSenha.js";
import validarTokenSenha from "./routes/validarTokenSenha.js";
import atualizarSenha from "./routes/atualizarSenha.js";
import buscarUsuario from "./routes/editPerfilUsuario.js";
import postRoutes from './routes/post.js'
import userPhoto from './routes/getUserPhoto.js'
import routerPublicacoes from './routes/publicacoes.js'
import adminRouter from './routes/admRouter.js';
import authorizeAdminRole from './middleware/authRole.js'

import UserRouter from './routes/UserRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


// middleware
app.use("/validate-token", validateToken);


app.use("/api/usuario", UserRouter)

// rotas publicas

app.use("/form/recuperar-senha", recuperarSenha);
app.use("/validar-token-senha", validarTokenSenha);
app.use("/atualizar-senha", atualizarSenha);


// rotas privadas (protegidas)
app.use("/usuarios", autenticarToken, buscarUsuario);
app.use("/criar-post/pet-perdido", autenticarToken, cadastrarPetPerdido);
app.use("/criar-post/pet-encontrado/", autenticarToken, cadastrarPetEncontrado);
app.use("/api/posts", autenticarToken, postRoutes);
app.use("/api/publicacoes", autenticarToken, routerPublicacoes);
app.use('/user', autenticarToken, userPhoto)

app.use('/api/adm', autenticarToken, authorizeAdminRole, adminRouter); 

export default app;
