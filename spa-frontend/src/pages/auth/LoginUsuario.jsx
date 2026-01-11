import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/spa.png"
import axios from "axios"

function LoginUsuario() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      )

      alert(data.msg)

      // Redirigimos al usuario segun su rol 
      if (data.rol === "admin") {
        return navigate("/reportes-admin")
      } else {
        return navigate("/dashboard")
      }
    } catch (error) {
      // Axios: la respuesta del backend viene aquí
      const data = error?.response?.data

      if (!data) {
        alert("Error de conexión con el servidor")
        return
      }

      // Estado true o false, para verificar desde el backend
      if (data.noVerificado) {
        alert(data.msg)
        localStorage.setItem("email", email)
        return navigate("/verificar-email-registro")
      }

      if (data.errores && data.errores.length > 0) {
        data.errores.forEach((err) => {
          alert(err.mensaje)
        })
      } else {
        alert(data.msg || "Error al iniciar sesión")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo establecimiento SPA"
            title="Logo establecimiento"
            className="mx-auto w-20 h-20 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenido a AquaSPA
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario de inicio de sesion del usuario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="correo@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlaces adicionales */}
        <div className="text-center mt-4 text-sm">
          <Link
            to="/recuperar-password"
            className="text-blue-600 hover:text-blue-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <div className="mt-2">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-blue-600 hover:text-blue-500">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginUsuario
