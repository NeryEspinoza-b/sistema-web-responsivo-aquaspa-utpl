const express = require('express')
const reporteRouter = express.Router()
const {estadisticasGenerales, reportesCompletos} = require('../controllers/reportesController')
// Ruta de estadísticas de forma general
reporteRouter.get('/estadisticas', estadisticasGenerales)

// Ruta para los reportes pero mas detalladamente
reporteRouter.get('/reportes/completos', reportesCompletos)

module.exports = reporteRouter
