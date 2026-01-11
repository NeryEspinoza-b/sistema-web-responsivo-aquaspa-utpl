import { useState, useEffect } from 'react'
import LayoutAdmin from '../../components/layout/LayoutAdmin'
import axios from 'axios'
function HistorialClinico() {
  const [clientes, setClientes] = useState([])
  const [historiales, setHistoriales] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [emailBusqueda, setEmailBusqueda] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modalEdicion, setModalEdicion] = useState(false)
  const [historialSeleccionado, setHistorialSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    usuarioId: '',
    tratamiento: '',
    fecha: new Date().toISOString().split('T')[0], //convierte en formato ISO separando fecha y hora
    observaciones: '',
    recomendaciones: ''
  })

  // Cargar  datos de clientes al renderizar
  useEffect(() => {
    traerClientes()
  }, [])

  // Traer todos los clientes registrados
  const traerClientes = async () => {
    setLoading(true)
    try {
      const {data} = await axios.get('http://localhost:5000/auth/admin/usuarios', {withCredentials: true })
      setClientes(data)
    } catch (error) {
      console.log('Error al traer clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar cliente por email
  const buscarCliente = (email) => {
    setEmailBusqueda(email)
    const clienteEncontrado = clientes.find(cliente => cliente.email === email)
    if (clienteEncontrado) {
      setClienteSeleccionado(clienteEncontrado)
      traerHistorial(clienteEncontrado._id)
    } else {
      setClienteSeleccionado(null)
      setHistoriales([])
    }
  }

  // Traer historial de un cliente
  const traerHistorial = async (usuarioId) => {
    try {
      const {data} = await axios.get(`http://localhost:5000/historial/cliente/${usuarioId}`, { withCredentials: true })
      setHistoriales(data)
    } catch (error) {
      console.log('Error al traer historial:', error)
    }
  }

  //Abrir modal para nuevo registro
  const abrirModal = () => {
    if (!clienteSeleccionado) {
      alert('Primero selecciona un cliente')
      return
    }
    setFormData({
      usuarioId: clienteSeleccionado._id,
      tratamiento: '',
      fecha: new Date().toISOString().split('T')[0],
      observaciones: '',
      recomendaciones: ''
    })
    setModalEdicion(false)
    setHistorialSeleccionado(null)
    setMostrarModal(true)
  }

  //Abrir modal para editar
  const abrirModalEditar = (historial) => {
    setFormData({
      usuarioId: historial.usuarioId?._id ?? clienteSeleccionado._id,
      tratamiento: historial.tratamiento || '',
      fecha: historial.fecha.split('T')[0],
      observaciones: historial.observaciones || '',
      recomendaciones: historial.recomendaciones || ''
    })
    setHistorialSeleccionado(historial)
    setModalEdicion(true)
    setMostrarModal(true)
  }

  const cerrarModal = () => setMostrarModal(false)

  //Crear nuevo historial
  const crearHistorial = async (nuevoHistorial) => {
    try {
      const {data} = await axios.post('http://localhost:5000/historial/crearHistorial', nuevoHistorial, { withCredentials: true,  headers: { 'Content-Type': 'application/json' }
      })
      alert(data?.msg || 'Historial creado correctamente')
      cerrarModal()
      traerHistorial(clienteSeleccionado._id)
  
    } catch (error) {
      console.error('Error al crear historial:', error)
      if(!error?.response){
        alert('No se pudo conectar con el servidor')
        return
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en crear el historial')
    }
  }

  //Editar historial existente
  const editarHistorial = async (id, historialEditado) => {
    try {
      const {data} = await axios.put(`http://localhost:5000/historial/actualizar/${id}`, historialEditado, { withCredentials: true,  headers: { 'Content-Type': 'application/json' }
      })
      alert(data?.msg || 'Historial actualizado correctamente')
      cerrarModal()
      traerHistorial(clienteSeleccionado._id)
    } catch (error) {
      console.error('Error al editar historial:', error)
      if(!error?.response){
        alert('No se pudo conectar con el servidor')
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en editar el historial')
    }
  }

  const eliminarHistorial = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este historial?")) return 
    try {
      const {data} = await axios.delete(`http://localhost:5000/historial/eliminar/${id}`, {
       withCredentials: true
      })      
      alert(data?.msg || 'Historial eliminado correctamente')
      traerHistorial(clienteSeleccionado._id)
    } catch (error) {
      console.error('Error en eliminar el historial', error)
      if(!error?.response){
        alert('No se pudo conectar con el servidor')
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en eliminar el historial del cliente')
    }
  }

  //Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (modalEdicion && historialSeleccionado) {
      await editarHistorial(historialSeleccionado._id, formData)
    } else {
      await crearHistorial(formData)
    }
  }

  //Cambiar campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return fecha.split('T')[0].split('-').reverse().join('/')
    }


  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Título */}
          <div className="flex justify-between items-start mb-8">
            <div>
            <div className="flex items-center mb-1">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">Historial Clínico</h1>
            </div>
            <p className="text-gray-700 text-base md:text-lg">Consulta y registra el seguimient de tus clientes</p>
          </div>
            <button
              onClick={abrirModal}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg disabled:bg-gray-400"
              disabled={!clienteSeleccionado}
            >
              + Nuevo Registro
            </button>
          </div>

          {/* Buscador */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Buscar por email</label>
            <input
              type="text"
              list="lista-clientes"
              value={emailBusqueda}
              onChange={(e) => buscarCliente(e.target.value)}
              placeholder="Escribe un email..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <datalist id="lista-clientes">
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente.email}>{cliente.nombre}</option>
              ))}
            </datalist>

            <button
              onClick={() => { setEmailBusqueda(''); setClienteSeleccionado(null); setHistoriales([]) }}
              className="bg-green-600 text-white mt-5 px-2 py-2 rounded-lg hover:bg-green-800 cursor-pointer"
            >
              Limpiar
            </button>
          </div>

          {/* Contenido principal */}
          {loading ? (
            <p className="text-center text-gray-600 py-12">Cargando clientes...</p>
          ) : !clienteSeleccionado ? (
            <p className="text-center text-gray-700 py-12 bg-white rounded-xl">Selecciona un cliente para ver su historial</p>
          ) : historiales.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 mb-4">Este cliente no tiene registros</p>
              <button
                onClick={abrirModal}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Crear Primer Registro
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {historiales.map((historial) => (
                <div key={historial._id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className='font-bold text-xl text-gray-900'>{historial.usuarioId?.nombre}</h2>
                    <span className="text-sm text-gray-500">{formatearFecha(historial.fecha)}</span>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Tratamiento: </strong>{historial.tratamiento}</p>
                  <p className="text-gray-700 mb-2"><strong>Observaciones:</strong> {historial.observaciones || 'Ninguna'}</p>
                  <p className="text-gray-700"><strong>Recomendaciones:</strong> {historial.recomendaciones || 'Ninguna'}</p>
                  <div className='flex justify-end items-center'>
                    <button
                      onClick={() => abrirModalEditar(historial)}
                      className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer mt-6'
                    >
                      Editar
                    </button>
                    <button onClick={() => eliminarHistorial(historial._id)} className='bg-red-600 text-white px-6 py-2 ml-2 rounded-lg hover:bg-red-700 cursor-pointer mt-6'>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {modalEdicion ? 'Editar Registro Clínico' : 'Nuevo Registro Clínico de Cliente'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={clienteSeleccionado?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <input
                type="text"
                name="tratamiento"
                value={formData.tratamiento}
                onChange={handleChange}
                placeholder="Tratamiento realizado"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500"
                required
              />
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500"
                required
              />
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500"
              />
              <textarea
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleChange}
                placeholder="Recomendaciones"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500"
              />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={cerrarModal} className="flex-1 bg-gray-200 py-3 rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
                  {modalEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutAdmin>
  )
}

export default HistorialClinico
