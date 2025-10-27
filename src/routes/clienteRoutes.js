import express from "express";
import { crearCliente, obtenerClientes } from "../controllers/clienteController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protegerRuta, crearCliente);
router.get("/", obtenerClientes);

export default router;
