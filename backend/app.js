import express from "express";
import cors from "cors";

import autenticarToken from "./middleware/authMiddleware.js";
import validateToken from "./routes/validateToken.js";
import PostRouter from './routes/post.js'
import routerPublicacoes from './routes/publicacoes.js'
import adminRouter from './routes/admRouter.js';
import authorizeAdminRole from './middleware/authRole.js'

import UserRouter from './routes/UserRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use("/validate-token", validateToken);

app.use("/api/usuario", UserRouter)

app.use("/api/posts", autenticarToken, PostRouter);
app.use("/api/publicacoes", autenticarToken, routerPublicacoes);

app.use('/api/adm', autenticarToken, authorizeAdminRole, adminRouter); 

export default app;
