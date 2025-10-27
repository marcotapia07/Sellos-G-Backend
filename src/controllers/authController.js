import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// --- Iniciar Sesión ---
export const login = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });

    const esValido = await usuario.compararContraseña(password);
    if (!esValido) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = generarToken(usuario._id, usuario.rol);
    res.json({ msg: "Inicio de sesión exitoso", token, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

// --- Recuperar Contraseña ---
export const solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ msg: "Correo no registrado" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    usuario.tokenRecuperacion = token;
    usuario.expiracionToken = Date.now() + 3600000;
    await usuario.save();

    // Configuración del correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const enlace = `http://localhost:3000/api/auth/restablecer/${token}`;
    await transporter.sendMail({
      to: usuario.correo,
      subject: "Recuperación de contraseña",
      html: `<p>Para restablecer tu contraseña haz clic en el siguiente enlace:</p>
             <a href="${enlace}">${enlace}</a>`,
    });

    res.json({ msg: "Correo de recuperación enviado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al procesar la solicitud" });
  }
};

// --- Restablecer Contraseña ---
export const restablecerContraseña = async (req, res) => {
  const { token } = req.params;
  const { nuevaContraseña } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || usuario.tokenRecuperacion !== token)
      return res.status(400).json({ msg: "Token inválido o expirado" });

    usuario.contraseña = nuevaContraseña;
    usuario.tokenRecuperacion = null;
    usuario.expiracionToken = null;
    await usuario.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al restablecer la contraseña" });
  }
};

// --- Actualizar Contraseña (desde perfil) ---
export const actualizarContraseña = async (req, res) => {
  const { contraseñaActual, nuevaContraseña } = req.body;
  const usuario = await Usuario.findById(req.usuario.id);

  const coincide = await usuario.compararContraseña(contraseñaActual);
  if (!coincide) return res.status(400).json({ msg: "La contraseña actual es incorrecta" });

  usuario.contraseña = nuevaContraseña;
  await usuario.save();

  res.json({ msg: "Contraseña actualizada" });
};
