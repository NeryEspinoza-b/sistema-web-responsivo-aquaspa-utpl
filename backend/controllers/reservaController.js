const Reserva = require('../models/Reserva.js')
const verificarToken = require('../middleware/verificarToken.js')
const {enviarCorreo} = require('../middleware/enviarCorreo.js')
const agenda = require('../config/agenda.js')

//Controlador para obtener las reservas con los horarios ocupados pero no las canceladas
exports.consultaReservasOcupadas = [verificarToken, async (req, res) => {
  try {
    const { fecha } = req.query
    if (!fecha) return res.json([])

    // Convertimos la fecha seleccionada a inicio y fin del día
    const inicioDia = new Date(fecha + 'T00:00:00')
    const finDia = new Date(fecha + 'T23:59:59')

    // Buscamos todas las reservas para esa fecha
    const reservas = await Reserva.find({
      fechaHora: { $gte: inicioDia, $lte: finDia }, 
      estado: {$ne: 'cancelada'} //excluimos las canceladas para que no las cuente y liberamos espacio en el calendario
    })

    // Extraemos solo la hora en formato 'HH:MM'
    const horasOcupadas = reservas.map(hora => {
      const date = new Date(hora.fechaHora)
      return date.toTimeString().slice(0, 5) // 'HH:MM'
    })

    res.json(horasOcupadas)
  } catch (error) {
    console.error(error)
    res.status(500).json([])
  }
}]

//Controlador para crear una reserva
exports.crearReserva = [verificarToken, async (req, res) => {
  const usuarioID = req.user.id
  try {
    const { servicioId, fecha, hora } = req.body
    if (!servicioId || !fecha || !hora) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
    }
    
    //combinamos fecha y hora
    const fechaHora = new Date(`${fecha}T${hora}:00`)
    const existe = await Reserva.findOne({ servicioId, fechaHora, estado: {$ne: 'cancelada'} })
    if (existe) return res.status(400).json({ msg: 'Horario ocupado' })

    const nuevaReserva = new Reserva({ usuarioId: usuarioID, servicioId, fechaHora, estado: 'pendiente' })
    await nuevaReserva.save()

    // Obtenemos los datos de la reserva
    const obtenerReserva = await Reserva.findById(nuevaReserva.id).populate('usuarioId', 'nombre email').populate('servicioId', 'nombre')
    
    const {nombre, email} = obtenerReserva.usuarioId
    const servicio = obtenerReserva.servicioId.nombre

    //formateamos fecha
    const fechaFormateada = fechaHora.toLocaleDateString('es-Ec', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    })

    //formateamos hora
    const horaFormateada = fechaHora.toLocaleTimeString('es-Ec', {
      hour: '2-digit', 
      minute: '2-digit'
    })

    const mensajeHTML = `
      <h2>Confirmación de Cita – AquaSPA</h2>
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Tu cita ha sido registrada correctamente con los siguiente detalles:</p>
      <ul>
        <li><strong>Servicio:</strong> ${servicio}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada}</li>
        <li><strong>Estado:</strong> Pendiente de confirmación</li>
      </ul>
      <p>Si tienes alguna consulta, comunícate con nosotros.</p>
      <p><strong>AquaSPA</strong></p>
    `
    await enviarCorreo(email, 'Confirmación de cita reservada', mensajeHTML)

    //Implementamos agenda
    //Se define la fecha y hora  con un día de anticipación para enviar el recordatorio
    const fechaRecordatorio = new Date(fechaHora.getTime() - 24 * 60 * 60 * 1000)
    const enviarInmediatamente = fechaRecordatorio.getTime() < Date.now()
    const datosRecordatorio = {
      correo: email, 
      nombre: nombre, 
      servicio: servicio, 
      fecha: fechaFormateada, 
      hora: horaFormateada
    }
    if(enviarInmediatamente){
      await agenda.now('Enviar recordatorio de reserva', datosRecordatorio)
    }
    else{
      await agenda.schedule(fechaRecordatorio, 'Enviar recordatorio de reserva', datosRecordatorio)
    }
    res.status(201).json({ msg: 'Reserva creada correctamente' })
  } catch (error) {
    console.error('Error al crear reserva:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}]

//Controlador para consultar reservas del usuario
exports.consultarReserva = [verificarToken, async (req, res) => {
  const usuarioId = req.user.id
    try {
        const existeCitas = await Reserva.find({usuarioId}).populate('servicioId').populate('usuarioId').sort({fechaHora: -1})
        if(!existeCitas) return res.status(404).json({msg: 'No existen citas actualmente'})
        return res.status(200).json(existeCitas)
    } catch (error) {
        console.error('Error en consultar las citas', error)
        res.status(500).json({msg: 'Error en consultar las citas', error})
    }
}]

//Controlador para cancelar las reservas del usuario
exports.cancelarReserva = [verificarToken, async (req, res) => {
  const { reservaId } = req.params
  try {
    const reserva = await Reserva.findById(reservaId).populate('usuarioId', 'nombre email').populate('servicioId', 'nombre')
    if (!reserva) {
      return res.status(404).json({ msg: 'Reserva no encontrada' })
    }

    // Solo cancelar si la rererva se esta pendiente o confirmada
    if (reserva.estado === 'pendiente' || reserva.estado === 'confirmada') {
      reserva.estado = 'cancelada'
      await reserva.save()

      //Correo de cancelación de cita
    const {nombre, email} = reserva.usuarioId
    const servicio = reserva.servicioId.nombre
    const fechaHora = reserva.fechaHora

    //Formateamos la fecha
    const fechaFormateada = fechaHora.toLocaleDateString('es-EC', {
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    })
    //formateamos la hora
    const horaFormateada = fechaHora.toLocaleTimeString('es-EC', {
      hour: '2-digit', 
      minute: '2-digit'
    })

    //Enviamos el correo de cancelación 
    const mensajeHTML = `
      <h2>Cancelación de Cita – AquaSPA</h2>
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Te informamos que tu cita ha sido cancelada correctamente.</p>
      <ul>
        <li><strong>Servicio:</strong> ${servicio}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada}</li>
      </ul>
      <p>Si deseas agendar una nueva cita, puedes hacerlo desde el sistema.</p>
      <p><strong>AquaSPA</strong></p>
    `
      await enviarCorreo(email, 'Cancelación de cita', mensajeHTML)

      return res.status(200).json({ msg: 'Reserva cancelada correctamente' })
    } else {
      return res.status(400).json({ msg: `No se puede cancelar una reserva ${reserva.estado}` })
    }
    
  } catch (error) {
    console.error('Error al cancelar reserva:', error)
    return res.status(500).json({ msg: 'Error al cancelar la reserva', error })
  }
}]