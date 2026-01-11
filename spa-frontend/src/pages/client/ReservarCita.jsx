import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import axios from 'axios'
function ReservarCita() {
  const navigate = useNavigate()
    
  //Estados
  const [servicios, setServicios] = useState([])
  const [formData, setFormData] = useState({
    servicioId: '',
    fecha: '',
    hora: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [citasOcupadas, setCitasOcupadas] = useState([])

  //Función para obtener la fecha actual en formato YYYY-MM-DD
  const getFechaActual = () => {
    const hoy = new Date()
    const año = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    return `${año}-${mes}-${dia}`
  }
  // Obtener los  servicios al cargar nuestro sistema
  useEffect(() => {
    obtenerServicios()
  }, [])

  //Función para obtener servicios
  const obtenerServicios = async () => {
    try {
      const {data} = await axios.get('http://localhost:5000/servicios/consulta', {
        withCredentials: true
      })
      setServicios(data)
    } catch (error) {
      console.error('Error al obtener servicios:', error)
      setError('Error al obtener los servicios')
    }
  }

  // Función para obtener horas ocupadas de una fecha
  const obtenerCitasOcupadas = async (fechaSeleccionada) => {
    try {
      const {data} = await axios.get(`http://localhost:5000/reservas/ocupadas?fecha=${fechaSeleccionada}`, {
        withCredentials: true
      })
      setCitasOcupadas(data)
    } catch (error) {
      console.error('Error al obtener citas ocupadas:', error)
      setError('Error al obtener las citas ocupadas')
    }
  }

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si cambió la fecha, obtener citas ocupadas
    if (name === 'fecha') {
      obtenerCitasOcupadas(value)
      setFormData((prev) => ({ ...prev, hora: '' })) // resetear hora seleccionada
    }
  }

  // Enviar reserva
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const {data} = await axios.post('http://localhost:5000/reservas/crear', formData,{
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }        
      })
        alert(data.msg || 'Reserva creada exitosamente')
        navigate('/mis-citas')

    } catch (error) {
      if(!error?.response){
        setError('Error en la conexión con el servidor')
      } else{
        const data = error.response.data
        setError(data?.msg || 'Error al realizar la reserva')
      }
      
    } finally {
      setLoading(false)
    }
  }

  // Horarios disponibles (puedes ajustar según nuestro SPA)
  const horasDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reservar Nueva Cita
              </h1>
              <p className="text-gray-600">
                Selecciona un servicio y elige tu horario preferido
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleccionar Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona un Servicio*
                </label>
                <select
                  name="servicioId"
                  value={formData.servicioId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio._id} value={servicio._id}>
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de la Cita */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la Cita*
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={getFechaActual()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Hora de la Cita */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de la Cita*
                </label>
                <select
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={!formData.fecha} // solo activo si hay fecha
                >
                  <option value="">Selecciona una hora</option>
                  {horasDisponibles.map((hora) => (
                    <option
                      key={hora}
                      value={hora}
                      disabled={citasOcupadas.includes(hora)}
                    >
                      {hora} {citasOcupadas.includes(hora) ? '(Ocupada)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón Confirmar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReservarCita
