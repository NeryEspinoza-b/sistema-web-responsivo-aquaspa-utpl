const Historial = require('../models/historialModel.js')
const verificarToken = require('../middleware/verificarToken.js')
const verificarRol = require('../middleware/verificarRol.js')

exports.crearHistorial = [verificarToken, verificarRol, async (req, res) => {
        const {usuarioId, tratamiento, fecha, observaciones, recomendaciones} = req.body
        try {
            const nuevoHistorial = new Historial({usuarioId, tratamiento, fecha, observaciones, recomendaciones})
            await nuevoHistorial.save()
            return res.status(201).json({msg: 'Historial registrado correctamente'})
        } catch (error) {
            console.error('Error en la creación del historial', error)
            res.status(500).json({msg: 'Error en la creación del historial', error})
        }
    }]

exports.clienteId = [verificarToken, verificarRol, async (req, res) =>{
        const {id} = req.params
        try {
            const historial = await Historial.find({usuarioId:id}).sort({fecha: -1}).populate('usuarioId', 'nombre email')
            if(!historial) return res.status(404).json({msg: 'No existen historiales para el cliente'})
            return res.status(200).json(historial)
        } catch (error) {
            console.error('Error en la consulta del historial del cliente', error)
            res.status(500).json({msg: 'Error en la consulta del historial del cliente', error})
        }
    }]

exports.actualizarHistorial = [verificarToken, verificarRol, async (req, res) => {
        const {id} = req.params
        const {tratamiento, fecha, observaciones, recomendaciones} = req.body
        try {
            const registroHistorial = await Historial.findById(id)
            if(!registroHistorial) return res.status(404).json({msg: 'No existe el historial'})
            
            if(tratamiento) registroHistorial.tratamiento = tratamiento     
            if(fecha) registroHistorial.fecha = fecha 
            if(observaciones !== undefined) registroHistorial.observaciones = observaciones 
            if(recomendaciones !== undefined) registroHistorial.recomendaciones = recomendaciones
            await registroHistorial.save()
            return res.status(201).json({msg: 'Registro actualizado correctamente'})

        } catch (error) {
            console.error('Error en actualizar el historial', error)
            res.status(500).json({msg: 'Error en actualizar el historial', error})
        }
    }]

exports.eliminarHistorial = [verificarToken, verificarRol, async (req, res) => {
    const {id} = req.params
    try {
        const existeHistorial = await Historial.findByIdAndDelete(id)
        if(!existeHistorial) return res.status(404).json({msg: 'Historial no encontrado'})
        res.status(200).json({msg: 'Historial eliminado correctamente'})
    } catch (error) {
        console.error('Error en la eliminacion del servicio', error)
        res.status(500).json({msg: 'Error en la eliminacion del servicio', error})
    }
}]