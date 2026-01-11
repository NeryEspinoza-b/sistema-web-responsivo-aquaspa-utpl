import { useState, useEffect } from 'react'
import LayoutAdmin from '../../components/layout/LayoutAdmin'
import axios from 'axios'
function ServiciosAdmin() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modalEdicion, setModalEdicion] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)

  const [imagen, setImagen] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: ''
  })

  useEffect(() => {
    obtenerServicios()
  }, [])

  const obtenerServicios = async () => {
    try {
      const {data} = await axios.get('http://localhost:5000/servicios/consulta', {
        withCredentials: true
      })
      setServicios(data)
    } catch (error) {
      console.error('Error:', error)
      if(!error?.response){
        alert('Error en la comunicación con el servidor')
        return
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en obtener los servicios')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const abrirModalNuevo = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      duracion: ''
    })
    setImagen(null)
    setModalEdicion(false)
    setMostrarModal(true)
  }

  const abrirModalEditar = (servicio) => {
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracion: servicio.duracion
    })
    setServicioSeleccionado(servicio)
    setImagen(null)
    setModalEdicion(true)
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setServicioSeleccionado(null)
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const form = new FormData()
    form.append('nombre', formData.nombre)
    form.append('descripcion', formData.descripcion)
    form.append('precio', formData.precio)
    form.append('duracion', formData.duracion)

    if (imagen) {
      form.append('imagen', imagen)
    }

    // ✅ EDITAR
    if (modalEdicion) {
      const { data } = await axios.put(
        `http://localhost:5000/servicios/${servicioSeleccionado._id}`,
        form,
        { withCredentials: true } // no pongas Content-Type, axios lo pone solo para FormData
      )

      alert(data?.msg || 'Servicio actualizado')
      cerrarModal()
      obtenerServicios()
      return
    }

    // ✅ CREAR
    const { data } = await axios.post(
      'http://localhost:5000/servicios/crear',
      form,
      { withCredentials: true }
    )

    alert(data?.msg || 'Servicio creado exitosamente')
    cerrarModal()
    obtenerServicios()

  } catch (error) {
    console.error('Error:', error)

    if (!error?.response) {
      alert('No se pudo conectar con el servidor')
      return
    }

    const data = error?.response?.data
    alert(data?.msg || 'Error al guardar el servicio')
  }
}


  const eliminarServicio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        const {data} = await axios.delete(`http://localhost:5000/servicios/eliminar/${id}`, {
          withCredentials: true
        })
        alert(data.msg || 'Servicio eliminado')
        obtenerServicios()
        
      } catch (error) {
        console.error('Error:', error)
        if(!error?.response){
          alert('Error en la comunicación con el servidor')
          return
        }
        const data = error?.response?.data
        alert(data?.msg || 'Error en eliminar el servicio')
      }
    }
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-3">
                <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h1 className="text-4xl font-bold text-gray-900">Gestión de Servicios</h1>
              </div>
              <p className="text-lg text-gray-600">
                Administra el catálogo de servicios del spa
              </p>
            </div>

            <button
              onClick={abrirModalNuevo}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo servicio
            </button>
          </div>

          {/* Grid de Servicios */}
          {loading ? (
            <p className="text-center text-gray-600 py-12">Cargando servicios...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((servicio) => (
                <div
                  key={servicio._id}
                  className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:border-green-300 transition-all"
                >
                  
                    <img
                      src={servicio.imagen ? `http://localhost:5000/uploads/servicios/${servicio.imagen}` : '/img/servicio-default.jpg'}
                      alt={servicio.nombre}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  

                  {/* Icono y Título */}
                  <div className="flex items-start mb-4">
                    <svg className="w-6 h-6 text-gray-700 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">
                      {servicio.nombre}
                    </h3>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {servicio.descripcion}
                  </p>

                  {/* Precio */}
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    $ {servicio.precio}
                  </p>

                  {/* Duracion */}
                  <p className='text-xl font-bold text-gray-900 mb-4'>
                    Duración: {servicio.duracion} min
                  </p>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModalEditar(servicio)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarServicio(servicio._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalEdicion ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre del Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={modalEdicion ? '' : "Ej: Facial Hidratante"}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!modalEdicion ? 'placeholder:text-gray-400' : ''}`}
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder={modalEdicion ? '' : "Describe los beneficios y características del servicio"}
                  rows="3"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!modalEdicion ? 'placeholder:text-gray-400' : ''}`}
                  required
                />
              </div>

              {/* Precio y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder={modalEdicion ? '' : '0.00'}
                    step="0.01"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!modalEdicion ? 'placeholder:text-gray-400' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    placeholder={modalEdicion ? '' : '60'}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!modalEdicion ? 'placeholder:text-gray-400' : ''}`}
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-green-100 file:text-green-700
                  hover:file:bg-green-200
                  cursor-pointer"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {modalEdicion ? 'Actualizar' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutAdmin>
  )
}

export default ServiciosAdmin