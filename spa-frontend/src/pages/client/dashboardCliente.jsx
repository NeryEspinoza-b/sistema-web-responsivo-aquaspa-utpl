import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import {Calendar, ClipboardList, CalendarCheck, PlusCircle, Timer} from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function DashboardCliente() {
  const navigate = useNavigate()
  const [citas, setCitas] = useState([])
  const [data, setData] = useState([])

  // Totales de forma dinámicos
  const totalReservas = citas.length
  const proximasCitas = citas.filter(
    (cita) => cita.estado === "pendiente" || cita.estado === "confirmada"
  ).length

  useEffect(() => {
    traerDatos()
    obtenerCitas()
  }, [])

  const traerDatos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/auth/datos", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })

      setData(data)
      console.log(data)
    } catch (error) {
      console.error("Error al traer datos:", error)
    }
  }

  const obtenerCitas = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/reservas/consulta", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })

      setCitas(data)
      console.log(data)
    } catch (error) {
      console.error("Error al obtener citas:", error)

    }
  }

  const primeraLetraMayuscula = (texto) => {
    if (!texto) return ""
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <div className="bg-green-50 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {data.nombre}</p>
        </div>

        <div className="px-8 pb-8">
          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Mis Reservas */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-medium text-gray-900">
                Mis Reservas
              </h3>
              <p className="text-3xl font-bold text-gray-800">{totalReservas}</p>
            </div>

            {/* Próximas Citas */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-medium text-gray-900">
                Próximas Citas
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {proximasCitas}
              </div>
            </div>

            {/* Acción Rápida */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="flex item-center gap-2 mb-4">
                  <PlusCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-base font-medium text-gray-900">
                  Acción Rapida
                </h3>
              </div>

              <button
                onClick={() => navigate("/reservar-cita")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Nueva cita
              </button>
            </div>
          </div>

          {/* Mis Últimas Citas */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Mis Últimas Citas
            </h3>

            <div className="space-y-4">
              {citas.map((cita) => (
                <div
                  key={cita._id}
                  className={`rounded-xl p-5 border transition-all duration-300
                            hover:shadow-xl hover:-translate-y-1
          ${
            cita.estado === "cancelada"
              ? "bg-red-50 border-red-200"
              : cita.estado === "confirmada"
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
                >
                  <div className="flex justify-between items-start">
                    {/* Información */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {cita.servicioId?.nombre || "Servicio eliminado"}
                      </h4>

                      <div className="flex items-center text-sm text-gray-800 mb-1">
                        <Timer className="w-4 h-4 mr-2 text-gray-600" />
                        <span>
                          {primeraLetraMayuscula(
                            new Date(cita.fechaHora).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-gray-800">{data.email}</p>
                    </div>

                    {/* Precio + Estado */}
                    <div className="text-right">
                      <span className="block font-bold text-gray-900 text-lg">
                        ${cita.servicioId?.precio || 0}
                      </span>

                      <span className="text-xs capitalize text-gray-800 mt-1 block">
                        {cita.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardCliente
