import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import logo from "../../assets/spa.png"
import axios from "axios"

function RestablecerPassword() {
  const navigate = useNavigate()
  const { token } = useParams() // para obtener nuesto token de la URL
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data } = await axios.post(
        `http://localhost:5000/auth/reset-password/${token}`,
        { password: formData.newPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      alert(data.msg || "Contraseña actualizada")
      // si tenemos exito redirimos al login
      navigate("/login")
    } catch (err) {
      // Si no hay respuesta, es error de conexión/red
      if (!err.response) {
        setError("No se pudo conectar con el servidor")
      } else {
        const data = err.response.data
        setError(data?.msg || "Error al restablecer la contraseña")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo de establecimiento SPA"
            className="mx-auto w-20 h-20 mx-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Establecer nueva contraseña
          </h2>
          <p className="text-gray-600 text-sm">
            Ingrese su nueva contraseña para AquaSPA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="••••••••"
              required
              minLength="8"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="••••••••"
              required
              minLength="8"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Guardando..." : "Establecer nueva contraseña"}
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Enlace volver */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RestablecerPassword
