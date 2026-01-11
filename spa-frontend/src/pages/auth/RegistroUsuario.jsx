import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/spa.png"
import axios from "axios"

function RegistroUsuario() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    telefono: "",
    cedula: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
    return regex.test(password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarPassword(formData.password)) {
      return alert(
        "La contraseña debe tener:\n" +
          "- Mínimo debe tener 8 caracteres\n" +
          "- Al menos debe tener 1 mayúscula\n" +
          "- Al menos  debe tener 1 minúscula\n" +
          "- Al menos debe tener 1 número"
      )
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/register",
        formData
      )

      localStorage.setItem("email", formData.email)
      alert(data.msg)
      navigate("/verificar-email-registro")
    } catch (error) {
      const data = error?.response?.data

      if (!data) {
        alert("Error de conexión con el servidor")
        return
      }

      if (data.errores && data.errores.length > 0) {
        const mensajes = data.errores.map((e) => `• ${e.mensaje}`).join("\n")
        alert(mensajes)
      } else {
        alert(data.msg || "Error en el registro")
      }
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
            title="logo de establecimiento"
            className="mx-auto h-20 w-20 mx-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Registrarse</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo Electrónico */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="Ej: Alexander Espinoza"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="+593 999-999-999"
              required
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="0701234567"
              required
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Género
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Masculino / Femenino / Otro</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-500"
              placeholder="Ingrese su dirección"
              required
            />
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-6"
          >
            Registrarse
          </button>
        </form>

        {/* Enlace a la vista de login */}
        <div className="text-center mt-4 text-sm">
          <span className="text-blue-600">¿Ya tienes una cuenta registrada? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-500 underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegistroUsuario
