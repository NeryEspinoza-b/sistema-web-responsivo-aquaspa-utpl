const express = require('express')
const historialRoutes = express.Router()
const {crearHistorial, clienteId, actualizarHistorial, eliminarHistorial} = require('../controllers/historialClinicoController')
const validarZod = require('../middleware/validarZod.js')
const {crearHistorialSchema, actualizarHistorialSchema, historialClienteSchema, eliminarHistorialSchema} = require('../shemas/historialSchema.js')

// Ruta para crear historial clínico del cliente
historialRoutes.post('/crearHistorial', validarZod(crearHistorialSchema), crearHistorial)

// Ruta para filtrar el cliente con su historial clínico
historialRoutes.get('/cliente/:id', validarZod(historialClienteSchema), clienteId)

// Ruta para actualizar historial clínico
historialRoutes.put('/actualizar/:id', validarZod(actualizarHistorialSchema), actualizarHistorial)

// Ruta para eliminar historial clínico
historialRoutes.delete('/eliminar/:id', validarZod(eliminarHistorialSchema), eliminarHistorial)

module.exports = historialRoutes