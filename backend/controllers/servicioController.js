const Servicio = require('../models/servicesModel.js')
const Reserva = require('../models/Reserva.js')
const verificarToken = require('../middleware/verificarToken.js')
const verificarRol = require('../middleware/verificarRol.js')

//Controlador para registrar un nuevo servicio
exports.crearServicio = [verificarToken, verificarRol, async (req, res) => {
    const {nombre, descripcion, precio, duracion} = req.body
    try {
        const existeServicio = await Servicio.findOne({nombre, descripcion, precio, duracion})
        if(existeServicio) return res.status(403).json({msg: 'El servicio ya se encuentra creado'})

        let nuevoServicio = new Servicio({nombre, descripcion, precio, duracion, imagen: req.file ? req.file.filename : null})
        await nuevoServicio.save()
        return res.status(201).json({msg: 'Servicio creado exitosamente', servicio: nuevoServicio})
    } catch (error) {
        console.error('Error en crear el nuevo servicio', error)
        res.status(500).json({msg: 'Error en crear el nuevo servicio', error})
    }
}]

//Controlador para obtener todos los servicios usuario autenticado
exports.consultarServicios = [verificarToken, async (req, res) => {
    try {
        const consultaServicio = await Servicio.find()
        if(!consultaServicio) return res.status(404).json({msg: 'No existen servicios'})
        return res.status(200).json(consultaServicio)
    } catch (error) {
        console.error('Error en traer los servicios', error)
        res.status(500).json({msg: 'Error en traer los servivicos', error})
    }
}]

//Controlador para obtener los servicios del establecimiento para la HomePage
exports.listaServicios = async (req, res) => {
  try {
    const consultarServicios = await Servicio.find()
    if(!consultarServicios) return res.status(404).json({msg: 'No existen servicios'})
    return res.status(200).json(consultarServicios)
  } catch (error) {
    console.error('Error en consultar el catalogo de servicios del SPA', error)
    res.status(500).json({msg: 'Error en consultar el catalogo de servicios del SPA'})
  }
}
//Controlador para obtener un servicio por su id
exports.obtenerServicioId = [verificarToken, verificarRol, async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id)
    if (!servicio) {
      return res.status(404).json({ msg: 'Servicio no encontrado' })
    }
    res.json(servicio)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]

//Controlador para actualizar un servicio
exports.actualizarServicio = [ verificarToken, verificarRol, async (req, res) => {
  const {id} = req.params
  try {
    const { nombre, descripcion, precio, duracion } = req.body

    const servicio = await Servicio.findById(id)
    if (!servicio) {
      return res.status(404).json({ msg: 'Servicio no encontrado' })
    }

    servicio.nombre = nombre || servicio.nombre
    servicio.descripcion = descripcion || servicio.descripcion
    servicio.precio = precio || servicio.precio
    servicio.duracion = duracion || servicio.duracion  

    if(req.file){
      servicio.imagen = req.file.filename
    }
    await servicio.save()

    res.json({
      msg: 'Servicio actualizado exitosamente',
      servicio
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]

//Controlador para eliminar un servicio
exports.eliminarServicio = [verificarToken, verificarRol, async (req, res) => {
  const { id } = req.params
  try {

    const reservasConServicios = await Reserva.findOne({servicioId:id, estado: {$in: ["pendiente", "confirmada"]}})
    if(reservasConServicios) return res.status(400).json({msg: 'No se posible eliminar el servicio porque se encuentra asociado a reservas'})

    const servicioEliminado = await Servicio.findByIdAndDelete(id)
    if (!servicioEliminado) {
      return res.status(404).json({ msg: 'Servicio no encontrado' })
    }
    res.json({ msg: 'Servicio eliminado exitosamente' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]