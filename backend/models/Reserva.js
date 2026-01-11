const mongoose = require('mongoose') 

const reservaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  
  },
  servicioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  fechaHora: {
    type: Date, // formato YYYY-MM-DD
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  },
  creadaEn: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Reserva', reservaSchema)
