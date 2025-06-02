import express from "express";
import AdminController from "../controllers/admController.js";

const router = express.Router();

router.get("/usuarios", AdminController.getUsuariosEDenuncias);
router.get("/denuncias", AdminController.getDenuncias);

export default router;
