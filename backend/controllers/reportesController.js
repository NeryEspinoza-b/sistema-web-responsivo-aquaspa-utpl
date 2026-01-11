const Reserva = require('../models/Reserva')
const Usuario = require('../models/authModel')
const Servicio = require('../models/servicesModel')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

exports.estadisticasGenerales = [ verificarToken, verificarRol, async (req, res) => {
  try {
    // Buscamos todas las reservas que esten confirmadas
    const reservasConfirmadas = await Reserva.find({ estado: 'confirmada' }).populate('servicioId')

    // Calculamos los ingresos sumando el precio del servicio
    let ingresosTotales = 0
    reservasConfirmadas.forEach(reserva => {
      if (reserva.servicioId && reserva.servicioId.precio) {
        ingresosTotales += parseFloat(reserva.servicioId.precio)
      }
    })

    // Contamos todas las citas completadas
    const citasCompletadas = reservasConfirmadas.length

    // Contamos todos los usuarios con su rol 'user'
    const totalClientes = await Usuario.countDocuments({ rol: 'user' })

    // Enviamos los datos obtenidos al frontend
    res.json({
      ingresosTotales,
      citasCompletadas,
      totalClientes
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ msg: 'Error al obtener estadísticas generales' })
  }
}]

exports.reportesCompletos = [verificarToken, verificarRol, async (req, res) => {
  try {
    const reservas = await Reserva.find().populate('servicioId')

    // Ingresos y citas por mes
    const ingresosPorMes = {}
    reservas.forEach(reserva => {
      
      // Solo se hace el reporte de las citas confirmadas
      if(reserva.estado !== 'confirmada') return
      const fecha = new Date(reserva.fechaHora)
      const mes = fecha.toLocaleString('es-ES', { month: 'short' })

      if (!ingresosPorMes[mes]) {
        ingresosPorMes[mes] = { mes, ingresos: 0, citas: 0 }
      }

      //Se cuenta las citas confirmadas
      ingresosPorMes[mes].citas += 1
      //sumamos los ingresos
      if (reserva.servicioId?.precio) {
        ingresosPorMes[mes].ingresos += parseFloat(reserva.servicioId.precio)
      }
    })

    const ingresosPorMesArray = Object.values(ingresosPorMes)

    //Distribución de reservas por su estado
    const estados = await Reserva.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } }
    ])

    const reservasPorEstado = estados.map(e => ({
      name: e._id,
      value: e.total
    }))

    //Top de los 5 servicios más solicitados
    const serviciosMasSolicitados = await Reserva.aggregate([
      { $group: { _id: '$servicioId', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 }
    ])
// Se obtiene el servicioId de la colección Servicios para obtener el nombre y armar el TOP 5 de forma detallada
    const servicios = await Servicio.find()
    const serviciosDetallados = serviciosMasSolicitados.map(s => {
      const servicio = servicios.find(serv => serv._id.toString() === s._id?.toString())
      return {
        nombre: servicio ? servicio.nombre : 'Desconocido',
        cantidad: s.cantidad
      }
    })

    res.json({
      ingresosPorMes: ingresosPorMesArray,
      reservasPorEstado,
      serviciosMasSolicitados: serviciosDetallados
    })
  } catch (error) {
    console.error('Error al generar reportes:', error)
    res.status(500).json({ msg: 'Error al generar reportes completos' })
  }
}]
