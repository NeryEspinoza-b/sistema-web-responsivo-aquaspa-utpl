const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI) 
        console.log('Base de datos conectada correctamente')
        return connect
    } catch (error) {
        console.error('Error en la conexión con la base de datos', error)
        process.exit(1)
    }
}

module.exports = connectDB