import express from "express";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} from "../controllers/adminController.js";
import { protegerRuta as verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Obtener todos los administradores
router.get("/", verifyToken, getAdmins);

// Crear nuevo administrador
router.post("/", createAdmin);

// Actualizar un administrador por ID
router.put("/:id", verifyToken, updateAdmin);

// Eliminar un administrador por ID
router.delete("/:id", verifyToken, deleteAdmin);

// Login administrador (retorna token JWT)
router.post("/login", loginAdmin);

export default router;
