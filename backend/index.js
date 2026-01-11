require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./config/db.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes.js')
const servicioRoutes = require('./routes/servicioRoutes.js')
const reserva = require('./routes/reservaRoutes.js')
const historialRoutes = require('./routes/historialClinicoRoutes.js')
const mapaRoutes = require('./routes/mapaClientesRoutes.js')
const reporteRouter = require('./routes/reportesRoutes.js')

//middleware de sanitización de datos
const helmet = require('helmet')
const sanitizarNoSql = require('./middleware/sanitizarDatos.js')
const sanitizarXSS = require('./middleware/sanitizarXSS.js')
const limiteDeSolicitudes = require('./middleware/rateLimit.js')

connectDB()
require('./config/agenda.js')
require('./jobs/recordatorioReservas.js')

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

// se implementa helmet para cabeceras headers de seguridad
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
)

app.use(cookieParser())
app.use(express.json())

// almacenar imagenes estaticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


//middleware de sanitización de datos y XSS
app.use(sanitizarNoSql)
app.use(sanitizarXSS)
//middleware de rate limit
//app.use(limiteDeSolicitudes)

//rutas del sistema
app.use('/auth', authRoutes)
app.use('/servicios', servicioRoutes)
app.use('/reservas', reserva)
app.use('/historial', historialRoutes)
app.use('/mapa', mapaRoutes)
app.use('/reportes', reporteRouter)

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
    console.log(`Servidor escuchando por el puerto ${PORT}`)
})

