import { useState, useEffect } from "react";
import LayoutAdmin from "../../components/layout/LayoutAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Users, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import axios from "axios";

  //Creamos una instancia con credencliales
  const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });


function ReportesAdmin() {
  const [estadisticas, setEstadisticas] = useState({
    totalReservas: 0,
    clientes: 0,
    serviciosActivos: 0,
  });

  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    ingresosTotales: 0,
    citasCompletadas: 0,
    totalClientes: 0,
  });

  const [reservasRecientes, setReservasRecientes] = useState([]);

  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [reservasPorEstado, setReservasPorEstado] = useState([]);
  const [serviciosMasSolicitados, setServiciosMasSolicitados] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORES_PIE = ["#be553eff", "#0d845cff", "#F59E0B", "#EF4444"];

  useEffect(() => {
    cargarTodoSecuencial();
  }, []);


  const cargarTodoSecuencial = async () => {
    setLoading(true);
    try {
      // 1) Estadísticas generales
      const { data: statsData } = await api.get("/reportes/estadisticas");
      setEstadisticasGenerales(statsData);

      // 2) Reportes detallados
      const { data: reportesData } = await api.get("/reportes/reportes/completos");
      setIngresosPorMes(reportesData?.ingresosPorMes || []);
      setReservasPorEstado(reportesData?.reservasPorEstado || []);
      setServiciosMasSolicitados(reportesData?.serviciosMasSolicitados || []);

      // 3) Stats de admin (tarjetas)
      const { data: estadisticasData } = await api.get("/auth/admin/estadisticas");
      setEstadisticas(estadisticasData);

      // 4) Reservas recientes
      const { data: reservasData } = await api.get("/auth/admin/reservas-recientes");
      setReservasRecientes(reservasData || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);

      if (!error?.response) {
        alert("No se pudo conectar con el servidor");
        return;
      }

      const data = error?.response?.data;
      alert(data?.msg || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(valor);
  };

  const formatearFecha = (fechaHora) => {
    const date = new Date(fechaHora);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <svg
                className="w-8 h-8 text-gray-700 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900">
                Estadísticas y Reportes
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Analiza el rendimiento y la actividad de tu spa.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 py-12">
              Cargando estadísticas...
            </p>
          ) : (
            <>
              {/* Cards de Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Total Reservas */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Total Reservas</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {estadisticas.totalReservas}
                  </p>
                </div>

                {/* Clientes */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Total Clientes</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {estadisticas.clientes}
                  </p>
                </div>

                {/* Servicios Activos */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Servicios Activos</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {estadisticas.serviciosActivos}
                  </p>
                </div>

                {/* Ingresos Totales */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatearMoneda(
                      estadisticasGenerales.ingresosTotales || 0
                    )}
                  </p>
                </div>

                {/* Citas Completadas */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    Citas Completadas
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {estadisticasGenerales.citasCompletadas || 0}
                  </p>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Actividad Reciente
                </h3>

                {reservasRecientes.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No hay actividad reciente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reservasRecientes.slice(0, 5).map((reserva) => (
                      <div
                        key={reserva._id}
                        className={`rounded-xl p-5 border transition-all duration-300
                                    hover:shadow-xl hover:-translate-y-1
                          ${
                            reserva.estado === "cancelada"
                              ? "bg-red-50 border-red-200"
                              : reserva.estado === "confirmada"
                              ? "bg-green-50 border-green-200"
                              : reserva.estado === "completada"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {reserva.servicioId?.nombre || "Servicio"}
                            </h4>

                            <p className="text-sm text-gray-800">
                              {reserva.usuarioId?.email || "cliente@email.com"}
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                              {formatearFecha(reserva.fechaHora)}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="block font-bold text-gray-900">
                              ${reserva.servicioId?.precio || 0}
                            </span>

                            <span className="text-xs capitalize text-gray-800">
                              {reserva.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Gráficos de estadisticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ingresos y Citas por Mes */}
                <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300
                                hover:shadow-xl hover:-translate-y-1" >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Ingresos y Citas por Mes
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ingresosPorMes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="ingresos"
                        fill="#0e9765ff"
                        name="Ingresos ($)"
                      />
                      <Bar dataKey="citas" fill="#0638a3ff" name="Citas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Distribución de Reservas por Estado */}
                <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300
                                hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Distribución de Reservas por Estado
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reservasPorEstado}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reservasPorEstado.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORES_PIE[index % COLORES_PIE.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top 5 Servicios Más Solicitados */}
              <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300
                              hover:shadow-xl hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Top 5 Servicios Más Solicitados
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviciosMasSolicitados} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={200} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default ReportesAdmin;