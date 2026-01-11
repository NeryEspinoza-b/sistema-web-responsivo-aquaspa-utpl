import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/spa.png"
import axios from "axios"

function VerificarEmailRegistro() {
  const navigate = useNavigate()
  const [otp, setVerificationCode] = useState("")
  const [email, setEmail] = useState(localStorage.getItem("email") || "") // guardamos el email temporalmente
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await axios.post(
        "http://localhost:5000/auth/verify-otp",
        { email, otp: otp },
        { headers: { "Content-Type": "application/json" } }
      )

      // Código correcto: limpiar email temporal y redirigir
      alert("Cuenta verificada correctamente")
      localStorage.removeItem("email")
      navigate("/login")
    } catch (err) {
      console.error(err)

      if (!err.response) {
        setError("Error de conexión con el servidor")
      } else {
        const data = err.response.data
        setError(data?.msg || "Error al verificar el código")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError("")

    try {
      await axios.post(
        "http://localhost:5000/auth/resendOtp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      )

      alert("Código reenviado a tu correo")
    } catch (err) {
      console.error(err)

      if (!err.response) {
        setError("Error de conexión con el servidor")
      } else {
        const data = err.response.data
        setError(data?.msg || "No se pudo reenviar el código")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <Link
            to="/login"
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver para iniciar sesión
          </Link>
        </div>

        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo de establecimiento SPA"
            title="logo de establecimiento"
            className="mx-auto h-20 w-20 mx-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verifica tu correo electrónico
          </h2>
          <p className="text-gray-600 text-sm">
            Te hemos enviado un código de 6 dígitos a{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="000000"
              maxLength="6"
              required
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              Introduce el código de verificación que te enviamos a tu correo
              electrónico.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">¿No recibiste el código? </span>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="text-blue-600 hover:text-blue-500 underline"
          >
            Reenviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificarEmailRegistro
