import { useState, useEffect } from 'react'
import LayoutAdmin from '../../components/layout/LayoutAdmin'
import axios from 'axios'
function ReservasAdmin() {
  const [reservas, setReservas] = useState([])
  const [filtros, setFiltros] = useState({
    busqueda: '',
    fecha: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    obtenerReservas()
  }, [])

  const obtenerReservas = async () => {
    setLoading(true)
    try {
      const {data} = await axios('http://localhost:5000/auth/admin/consulta', {
        withCredentials: true
      })
      setReservas(data)
    } catch (error) {
      
      if(!error?.response){
        alert('Error en la comunicación con el servidor')
        return
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error en obtener las reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    })
  }

  const cambiarEstado = async (id, estado) => {
    try {
      if(estado === 'cancelada'){
        const confirmar = window.confirm("Estas seguro de cancelar esta reserva?")
        if(!confirmar) return
      }
      const {data} = await axios.put(`http://localhost:5000/auth/admin/reservas/${id}/estado`, {estado}, { withCredentials: true
      })
       
        alert(data?.msg || 'Estado actualizado')
        // Actualizamos solo la reserva modificada localmente
        obtenerReservas()
          
    } catch (error) {
      console.error("Error", error)
      if(!error?.response){
        alert('Error en la comunicación con el servidor')
        return
      }
      const data = error?.response?.data
      alert(data?.msg || 'Error al actualizar estado')
    }
  }

  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatearHora = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700'
    }
    return colores[estado] || 'bg-gray-100 text-gray-700'
  }

  //Función para conviertir una fecha a formato YYYY-MM-DD
  //Y pueda usarse en un input type="date"
  const formatearFechaInput = (fecha) => {
    const date = new Date(fecha)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const reservasFiltradas = reservas.filter(reserva => {
    const cumpleBusqueda = !filtros.busqueda ||
      reserva.usuarioId?.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      reserva.usuarioId?.email?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      reserva.servicioId?.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase())

    const cumpleFecha = !filtros.fecha || formatearFechaInput(reserva.fechaHora) === filtros.fecha

    return cumpleBusqueda && cumpleFecha
  })

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">Gestión de Reservas</h1>
            </div>
            <p className="text-lg text-gray-600">Visualiza y administra todas las citas del spa</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
                placeholder="Buscar por cliente o servicio..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="fecha"
                value={filtros.fecha}
                onChange={handleFiltroChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tabla de todas las reservas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <p className="text-center text-gray-600 py-12">Cargando reservas...</p>
            ) : reservasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No se encontraron reservas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Servicio</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hora</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reservasFiltradas.map((reserva) => (
                      <tr key={reserva._id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm text-gray-900">{reserva.usuarioId?.nombre || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reserva.servicioId?.nombre || 'Servicio eliminado'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatearFecha(reserva.fechaHora)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatearHora(reserva.fechaHora)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${reserva.servicioId?.precio || '0.00'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2" >
                            {reserva.estado === 'pendiente' && (
                              <button
                                onClick={() => cambiarEstado(reserva._id, 'confirmada')}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                              >
                                Confirmar
                              </button>
                            )}
                            {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                              <button
                                onClick={() => cambiarEstado(reserva._id, 'cancelada')}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default ReservasAdmin
