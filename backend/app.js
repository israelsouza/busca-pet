import express from "express";
import cors from "cors";

import authorizeAdminRole from './middleware/authRole.js'
import autenticarToken from "./middleware/authMiddleware.js";

import validateToken from "./routes/validateToken.js";
import UserRouter from './routes/UserRouter.js';
import PostRouter from './routes/post.js'
import NotificationRouter from './routes/NotificationRouter.js'
import AdmRouter from './routes/admRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/validate-token", validateToken);
app.use("/api/usuario", UserRouter)
app.use("/api/posts", autenticarToken, PostRouter);
app.use("/api/notificacao", autenticarToken, NotificationRouter);

app.use('/api/adm', autenticarToken, authorizeAdminRole, AdmRouter); 

export default app;
