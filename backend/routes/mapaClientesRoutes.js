const express = require("express")
const mapaRoutes = express.Router()
const {clientesMapa} = require('../controllers/mapaController')

//Ruta para obtener la ubicación del cliente y pintar en el mapa y estadísticas
mapaRoutes.get("/clientes-mapa", clientesMapa )

module.exports = mapaRoutes
