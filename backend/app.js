import express from "express";
import cors from "cors";

import autenticarToken from "./middleware/authMiddleware.js";

import ValidateToken from "./routes/ValidateToken.js";
import UserRouter from './routes/UserRouter.js';
import PostRouter from './routes/PostRouter.js'
import NotificationRouter from './routes/NotificationRouter.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/validate-token", ValidateToken);

app.use("/api/usuario", UserRouter)
app.use("/api/posts", autenticarToken, PostRouter);
app.use("/api/notificacao", autenticarToken, NotificationRouter);

export default app;
