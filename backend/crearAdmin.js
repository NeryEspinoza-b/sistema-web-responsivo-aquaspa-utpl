require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Usuario = require('./models/authModel.js')

async function crearAdmin(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Base de datos conectada correctamente')
        
        const existeAdmin = await Usuario.findOne({rol: 'admin'})
        if(existeAdmin){
            console.log('Ya existe un usuario con rol admin')
            return process.exit(1)
        }

        const admin = new Usuario({
            nombre: "Administrador",
            email: "admin@spa.com",
            password: bcrypt.hashSync("Admin123*", 10),
            telefono: "0999999999",
            cedula: "0000000000",
            fechaNacimiento: "1990-01-01",
            genero: "Masculino",
            direccion: "Dirección SPA",
            rol: "admin",
            
            //Ya que el modelo del usuario usa OTP y verificación
            isVerified: true,
            otp: null,
            otpExpires: null
        })

        await admin.save()
        console.log('Usuario administrador registrado correctamente')
        process.exit()

    } catch (error) {
        console.log('Error en la creación del usuario administrador')
        process.exit(1)

    }
}

crearAdmin()