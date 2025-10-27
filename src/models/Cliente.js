import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    default: ""
  },
  direccion: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Cliente", clienteSchema);
