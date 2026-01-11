const express = require('express')
const router = express.Router()
const validarZod = require('../middleware/validarZod.js')
const {consultaReservasOcupadas, crearReserva, consultarReserva, cancelarReserva} = require('../controllers/reservaController')
const {crearReservaSchema, cancelarReservaSchema, reservasOcupadasSchema} = require('../shemas/reservaSchema.js')

//Ruta para obtener las reservas ocupadas para el calendario de disponibilidad
router.get('/ocupadas', validarZod(reservasOcupadasSchema), consultaReservasOcupadas)

//Ruta que permite la creación de reserva por parte del cliente
router.post('/crear', validarZod(crearReservaSchema), crearReserva)

//Ruta que permite consulta de reserva por parte del cliente
router.get('/consulta', consultarReserva)

//Ruta que permite la cancelación de reserva por parte del cliente
router.put('/:reservaId/cancelar', validarZod(cancelarReservaSchema), cancelarReserva)

module.exports = router
