import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import LayoutAdmin from '../../components/layout/LayoutAdmin'
import axios from 'axios'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapaClientes() {
  const [clientes, setClientes] = useState([])
  const [resumenCiudades, setResumenCiudades] = useState({})
  const [center] = useState([-1.831239, -78.183406]) // Coordenadas de Ecuador
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    obtenerClientesConUbicacion()
  }, [])

  const obtenerClientesConUbicacion = async () => {
    try {
      const {data} = await axios.get('http://localhost:5000/mapa/clientes-mapa', {
        withCredentials: true
      })      
      setClientes(data?.clientes || [])
      setResumenCiudades(data?.resumenCiudades || {})
    } catch (error) {
      console.error('Error:', error)
      if(!error?.response){
        alert('No se pudo conectar con el servidor')
        return
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en obtener los clientes con su ubicación')
    } finally {
      setLoading(false)
    }
  }

  const totalClientes = clientes.length

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header del componente de mapa */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">Mapa de Clientes del SPA</h1>
            </div>
            <p className="text-lg text-gray-600">
              Total de clientes de AquaSpa: <strong>{totalClientes}</strong>
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 py-12">Cargando mapa...</p>
          ) : (
            <>
              {/* Mapa */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-200">
                  <MapContainer
                    center={center}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {clientes.map((cliente) => (
                      cliente.ubicacion && (
                        <Marker
                          key={cliente._id}
                          position={[cliente.ubicacion.lat, cliente.ubicacion.lng]}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-gray-900">
                                {cliente.nombreCompleto || cliente.nombre}
                              </h3>
                              <p className="text-sm text-gray-600">{cliente.email}</p>
                              {cliente.ciudad && (
                                <p className="text-sm text-gray-500 mt-1">📍 {cliente.ciudad}</p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                </div>
              </div>

              {/* Resumen por Ciudad */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen por Ciudad</h2>
                {Object.keys(resumenCiudades).length === 0 ? (
                  <p className="text-gray-500">No hay datos de ubicación disponibles</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(resumenCiudades)
                      .sort((a, b) => b[1] - a[1])
                      .map(([ciudad, cantidad]) => (
                        <div key={ciudad} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="font-semibold text-gray-900">{ciudad}</span>
                          <span className="text-gray-600">
                            {cantidad} {cantidad === 1 ? 'Cliente' : 'Clientes'}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default MapaClientes