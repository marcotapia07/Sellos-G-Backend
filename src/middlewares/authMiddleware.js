import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Middleware general para verificar token
export const protegerRuta = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id).select("-password");
    if (!req.usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

// Middleware adicional para restringir a administradores
export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "administrador") {
    return res.status(403).json({ msg: "Acceso denegado: Solo administradores" });
  }
  next();
};
