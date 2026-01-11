const express = require('express')
const servicioRoutes = express.Router()
const {crearServicio, consultarServicios, obtenerServicioId,listaServicios, actualizarServicio, eliminarServicio} = require('../controllers/servicioController')
const validarZod = require('../middleware/validarZod.js')
const {crearServicioSchema,actualizarServicioSchema,servicioIdSchema} = require('../shemas/servicioSchema.js')
const uploadServicio = require('../middleware/uploadServicio.js')

//Ruta para crear un servicio
servicioRoutes.post('/crear', uploadServicio.single('imagen'), validarZod(crearServicioSchema), crearServicio)

//Ruta para consultar servicios
servicioRoutes.get('/consulta', consultarServicios)

//Ruta para consultar servicios para la HomePage
servicioRoutes.get('/listarServicios', listaServicios)

//Ruta para obtener por el id del servicio
servicioRoutes.get('/:id', validarZod(servicioIdSchema), obtenerServicioId)

//Ruta para actualizar servicio (solo admin)
servicioRoutes.put('/:id', uploadServicio.single('imagen'), validarZod(actualizarServicioSchema), actualizarServicio)

//Ruta para eliminar servicio (solo admin)
servicioRoutes.delete('/eliminar/:id', validarZod(servicioIdSchema), eliminarServicio)

module.exports = servicioRoutes