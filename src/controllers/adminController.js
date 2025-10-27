import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Obtener todos los administradores
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo administrador
export const createAdmin = async (req, res) => {
  try {
    const { nombre, apellido, cedula, telefono, correo, password } = req.body;

    // Verificar si el correo ya existe
    const existeAdmin = await Admin.findOne({ correo });
    if (existeAdmin) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      nombre,
      apellido,
      cedula,
      telefono,
      correo,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Administrador creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un administrador
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Si el body contiene "password", encriptarla antes de guardar
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un administrador
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Administrador eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login de administrador
export const loginAdmin = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar al admin
    const admin = await Admin.findOne({ correo });
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign({ id: admin._id, rol: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        correo: admin.correo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
