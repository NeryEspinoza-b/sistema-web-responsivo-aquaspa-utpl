const mongoose = require('mongoose')
const historialSchema = mongoose.Schema({
    usuarioId: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true}, 
    tratamiento: {type: String, required: true}, 
    fecha: {type: Date, required: true, default: Date.now}, 
    observaciones: {type: String, default: ""}, 
    recomendaciones: {type: String, default: ""}
})
module.exports = mongoose.model('HistorialClinico', historialSchema)