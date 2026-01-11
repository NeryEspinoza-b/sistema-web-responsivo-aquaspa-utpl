import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import axios from 'axios'

function MisCitas() {
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    obtenerReservas()
  }, [])

  const obtenerReservas = async () => {
    try {
      const {data} = await axios.get('http://localhost:5000/reservas/consulta', {
        withCredentials: true
      })
      setReservas(data)

    } catch (error) {
      console.error('Error al obtener reservas:', error)

      if(error?.response){
        navigate('/home')
      }
    } finally {
      setLoading(false)
    }
  }

  const cancelarReserva = async (reservaId) => {
    if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      try {
        const {data} = await axios.put(`http://localhost:5000/reservas/${reservaId}/cancelar`,
        {}, 
        {withCredentials: true}
        )
        
        alert(data.msg ||'Reserva cancelada exitosamente')
          obtenerReservas()
        }
      catch (error) {
        console.error('Error al cancelar:', error)
        const data = error?.response?.data
        alert(data?.msg || 'Error en cancelar la cita')
      }
    }
  }

  const formatearFecha = (fechaHora) => {
    const date = new Date(fechaHora)
    const opciones = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return date.toLocaleDateString('es-ES', opciones)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-blue-100 text-blue-700'
      case 'confirmada':
        return 'bg-green-100 text-green-700'
      case 'completada':
        return 'bg-purple-100 text-purple-700'
      case 'cancelada':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'En espera de confirmación'
      case 'confirmada':
        return 'Tu cita está confirmada'
      case 'completada':
        return 'Completada'
      case 'cancelada':
        return 'Tu cita está cancelada'
      default:
        return estado
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">Mis Citas</h1>
            </div>
            <p className="text-lg text-gray-600">
              Aquí puedes ver el historial de tus citas y gestionar las próximas.
            </p>
          </div>

          {/* Lista de Citas */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando citas...</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes citas programadas</h3>
              <p className="text-gray-500 mb-6">Reserva tu primera cita ahora</p>
              <button
                onClick={() => navigate('/servicios')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Ver Servicios
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div
                  key={reserva._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    {/* Información de la cita */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {reserva.servicioId?.nombre || 'Servicio eliminado'}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {formatearFecha(reserva.fechaHora)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-3">
                        $ {reserva.servicioId?.precio || 0}
                      </p>
                    </div>

                    {/* Estado */}
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                  </div>

                  {/* Botón cancelar si está pendiente o confirmada */}
                  {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => cancelarReserva(reserva._id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar cita
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Botón para nueva cita */}
          {reservas.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/reservar-cita')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Reservar Nueva Cita
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MisCitas