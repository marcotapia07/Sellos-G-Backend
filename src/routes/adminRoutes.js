import express from "express";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  generarReporteVentas,
  generarReporteUsuarios,
  exportarReporteCSV,
} from "../controllers/adminController.js";

import { protegerRuta, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ADMINISTRADORES
router.get("/", protegerRuta, soloAdmin, getAdmins);
router.post("/", protegerRuta, soloAdmin, createAdmin);
router.put("/:id", protegerRuta, soloAdmin, updateAdmin);
router.delete("/:id", protegerRuta, soloAdmin, deleteAdmin);
router.post("/login", loginAdmin);

// GESTIÓN DE USUARIOS
router.get("/usuarios", protegerRuta, soloAdmin, listarUsuarios);
router.put("/usuarios/:id", protegerRuta, soloAdmin, actualizarUsuario);
router.delete("/usuarios/:id", protegerRuta, soloAdmin, eliminarUsuario);

// REPORTES
router.get("/reportes/ventas", protegerRuta, soloAdmin, generarReporteVentas);
router.get("/reportes/usuarios", protegerRuta, soloAdmin, generarReporteUsuarios);
router.get("/reportes/exportar/csv", protegerRuta, soloAdmin, exportarReporteCSV);

export default router;
