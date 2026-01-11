const mongoose = require('mongoose')
const serviceSchema = mongoose.Schema({
    nombre: {type: String, required: true}, 
    descripcion: {type: String, required: true}, 
    precio: {type: String, required: true}, 
    duracion: {type: Number, required: true}, 
    imagen: {type: String, default: null}
})


module.exports  = mongoose.model('Servicio', serviceSchema)