import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import { User } from "lucide-react"
import axios from 'axios'
function MiPerfil() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    cedula: "",
    genero: "",
  })
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const disabledOnclic = () => setDisabled(false)

  // Cargar datos iniciales desde backend
  useEffect(() => {
    const axiosUsuario = async () => {
      try {
        const {data} = await axios.get("http://localhost:5000/auth/mi-perfil", {
          withCredentials: true, 
          headers: {
            "Content-Type" : "application/json"
          }        

        }) // Realizamos GET con los datos actuales

        console.log(data)

        // Mapeamos los nombres del backend a frontend
        setFormData({
          nombre: data.nombre || "",
          email: data.email || "",
          telefono: data.telefono || "",
          fechaNacimiento: data.fechaNacimiento
            ? data.fechaNacimiento.split("T")[0]
            : "",
          direccion: data.direccion || "",
          cedula: data.cedula || "",
          genero: data.genero || "",
        })
      } catch (error) {
        console.error(error)
      }
    }

    axiosUsuario()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")

    try {
        const {data} = await axios.put("http://localhost:5000/auth/mi-perfil", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },        
      })
      //Si tenemos un ok 
      setMensaje("Perfil actualizado correctamente")
      setDisabled(true)
      
    } catch (error) {
      console.error(error)

      //Error de conexion con el servidor
      if (!error.response) {
        setMensaje('No se pudo conectar con el servidor')          
      }
       else{
        const data = error.response.data

        if (data.errores && data.errores.length > 0) {
          const mensajes = data.errores.map(e => `• ${e.mensaje}`).join('\n')
          setMensaje(mensajes)
        } else {
          setMensaje(data?.msg || 'Error al actualizar el perfil')
        }
      }
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-green-50">
        <div className="bg-green-50 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="w-6 h-6 mr-2" />
            Mi Perfil
          </h1>
          <p className="text-green-600">
            Administra tu información personal y preferencias.
          </p>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {formData.nombre}
                </h2>
                <p className="text-sm text-gray-600">{formData.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-200"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {mensaje && (
                <p className="mt-4 text-sm text-blue-500 text-center font-medium">{mensaje}</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-md mx-5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                onClick={disabledOnclic}
                >
                  Modificar Datos
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MiPerfil
