import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/spa.png"
import axios from "axios"

function EnlaceEmailPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email },
        { withCredentials: true }
      )

      navigate("/revisar-email-password", {
        state: { email },
      })
    } catch (err) {
      // Error de red no existe respuesta del servidor
      if (!err.response) {
        setError("No se pudo conectar con el servidor")
        return
      }
      const data = err.response.data
      setError(data?.msg || "Error al enviar el enlace")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo y título del establecimieno SPA*/}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo de establecimiento SPA"
            className="mx-auto w-20 h-20 mx-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Restablecer contraseña
          </h2>
          <p className="text-gray-600 text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario de recuperar la contraseña */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {/* Presentar error */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Enlace de volver */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EnlaceEmailPassword
