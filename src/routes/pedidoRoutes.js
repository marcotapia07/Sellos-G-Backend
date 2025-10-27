import express from "express";
import {
  crearPedido,
  obtenerPedidos,
  filtrarPedidos,
  actualizarPedido,
  eliminarPedido
} from "../controllers/pedidoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protegerRuta, crearPedido);
router.get("/filtrar", protegerRuta, filtrarPedidos);
router.get("/", protegerRuta, obtenerPedidos);
router.put("/:id", protegerRuta, actualizarPedido);
router.delete("/:id", protegerRuta, eliminarPedido);

export default router;
