import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import axios from 'axios'
function Servicios() {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  // Obtener todos los servicios del backend
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
      console.error('Error al obtener servicios:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar servicios por búsqueda
  const serviciosFiltrados = servicios.filter((servicio) =>
    (servicio?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (servicio?.descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
)


  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Catálogo de Servicios
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Descubre todos nuestros tratamientos de belleza y bienestar
            </p>

            {/* Buscador */}
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Grid de Servicios */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando servicios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosFiltrados.map((servicio) => (
                <div
                  key={servicio._id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Imagen del servicio */}
                  <div className="mb-4">
                    <img
                      src={
                        servicio.imagen
                          ? `http://localhost:5000/uploads/servicios/${servicio.imagen}`
                          : '/img/servicio-default.jpg'
                      }
                      alt={servicio.nombre}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/img/servicio-default.jpg'
                      }}
                    />
                  </div>

                  {/* Nombre */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {servicio.nombre}
                  </h3>


                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {servicio.descripcion}
                  </p>

                  {/* Precio */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      $ {servicio.precio}
                    </p>
                  </div>

                  {/* Botón Reservar */}
                  <button
                    onClick={() => navigate("/reservar-cita")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Reservar cita
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje cuando no existe ningun resultados */}
          {!loading && serviciosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron servicios</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Servicios