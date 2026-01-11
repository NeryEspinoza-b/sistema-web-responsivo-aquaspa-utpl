const mongoose = require('mongoose')
const userShema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}, 
    nombre: {type: String, required: true}, 
    telefono: {type: String, required: true}, 
    cedula: {type: String, required: true, unique: true}, 
    fechaNacimiento: {type: Date, required: true}, 
    genero: {type: String, enum: ["Masculino", "Femenino", "Otro"]}, 
    direccion: {type: String},
    rol: {type: String, enum: ['user', 'admin'], default: 'user'},
    fechaRegistro: {type: Date, default: Date.now}, 
    ubicacion: {lat: {type: Number}, lng: {type: Number}},
    otp: {type: String}, 
    otpExpires: {type: Date}, 
    isVerified: {type: Boolean, default: false}, 
    tokenContrasena: {type: String}, 
    tokenContrasenaExpires: {type: Date}
})

module.exports = mongoose.model('Usuario', userShema)