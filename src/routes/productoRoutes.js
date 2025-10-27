import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  buscarProductos,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", obtenerProductos);
router.get("/buscar/:termino", buscarProductos);
router.get("/:id", obtenerProducto);

// Rutas privadas (Admin / Empleado)
router.post("/", protegerRuta, crearProducto);
router.put("/:id", protegerRuta, actualizarProducto);
router.delete("/:id", protegerRuta, eliminarProducto);

export default router;
