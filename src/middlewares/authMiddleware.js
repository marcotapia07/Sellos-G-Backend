import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const protegerRuta = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
