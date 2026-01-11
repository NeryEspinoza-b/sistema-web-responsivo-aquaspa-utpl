import { useState, useEffect } from 'react'
import LayoutAdmin from '../../components/layout/LayoutAdmin'
import DataTable from 'datatables.net-react'
import DT from 'datatables.net-dt'
import axios from 'axios'

//Plugin que permite responsividad
import Responsive from 'datatables.net-responsive'

//CSS de DataTables
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
//CSS Responsive
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css'

DataTable.use(DT)
DataTable.use(Responsive)

function ClientesAdmin() {
  const [clientes, setClientes] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modalEdicion, setModalEdicion] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    fechaNacimiento: '',
    direccion: '',
    genero: ''
  })

  useEffect(() => {
    obtenerClientes()
  }, [])

  const obtenerClientes = async () => {
    try {
      const {data} = await axios.get('http://localhost:5000/auth/admin/usuarios', {
        withCredentials: true
      })
      setClientes(data)
    } catch (error) {
      console.error('Error:', error)
      const data = error?.response?.data
      alert(data?.msg || 'Error al obtener clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const abrirModalEditar = (cliente) => {
    setFormData({
      nombre: cliente.nombre || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      cedula: cliente.cedula || '',
      fechaNacimiento: cliente.fechaNacimiento
        ? cliente.fechaNacimiento.split('T')[0]
        : '',
      direccion: cliente.direccion || '',
      genero: cliente.genero || ''
    })
    setClienteSeleccionado(cliente)
    setModalEdicion(true)
    setMostrarModal(true)
  }

  const cerrarModal = () => {
  setMostrarModal(false)
  setClienteSeleccionado(null)
  setModalEdicion(false)
  setFormData({
    nombre: '',
    email: '',
    telefono: '',
    cedula: '',
    fechaNacimiento: '',
    direccion: '',
    genero: ''
  })
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      //Editar
      if(modalEdicion){
        const {data} = await axios.put(`http://localhost:5000/auth/admin/usuarios/editar/${clienteSeleccionado._id}`, formData, 
        {withCredentials: true, headers: {'Content-Type': 'application/json' }}
         )
      alert(data?.msg ||'Cliente actualizado correctamente')
      cerrarModal()
      obtenerClientes()
      return
      }
     
      const {data} = await axios.post('http://localhost:5000/auth/admin/usuarios/crear', formData, 
        {withCredentials: true, headers: {'Content-Type' : 'application/json'}}
      )
        alert(data?.msg || 'Cliente creado exitosamente')
        cerrarModal()
        obtenerClientes()
    
      }
     catch (error) {
      console.error('Error en guardar el cliente:', error)
      if(!error?.response){
        alert('No se pudo conectar con el servidor')
        return
        
      }
      const data = error?.response?.data
      
        if (data?.errores && data?.errores.length > 0) {
          const mensajes = data.errores.map(e => `• ${e.mensaje}`).join('\n')
          alert(mensajes)
        } else {
          alert(data?.msg || 'Error al guardar el cliente')
        }
    }
  }

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        const {data} = await axios.delete(
          `http://localhost:5000/auth/admin/usuarios/eliminar/${id}`,
          { withCredentials: true }
        )
        alert(data?.msg || 'Cliente eliminado')
        obtenerClientes()
        }
      catch (error) {
        console.error('Error:', error)
        if(!error?.response){
          alert('No se pudo conectar con el servidor')
          return
        }
        const data = error?.response?.data
        alert(data?.msg || 'Error en eliminar el cliente')
      }
    }
  }

  const formatearFecha = (fechaHora) => {
    if (!fechaHora) return ''
    return fechaHora.split('T')[0].split('-').reverse().join('/')
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Gestión de Clientes
            </h1>
            <p className="text-lg text-gray-600">
              Administra la información de tus clientes
            </p>
          </div>

          {/* Tabla */}
          {loading ? (
            <p className="text-center py-12">Cargando clientes...</p>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <DataTable
                className="display stripe hover w-full"
                options={{
                  //Permitir responsividad  de DataTables Responsive
                  responsive: true,
                  autoWidth: false,

                  // Se prioriza qué columnas se quedan visibles en móvil
                  columnDefs: [
                    { responsivePriority: 1, targets: 0 },   // Nombre
                    { responsivePriority: 2, targets: -1 }   // Acciones
                  ],

                  pageLength: 10,
                  language: {
                    search: "Buscar Cliente:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ clientes",
                    paginate: {
                      previous: "Anterior",
                      next: "Siguiente"
                    },
                    emptyTable: "No hay clientes registrados"
                  }
                }}
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Cédula</th>
                    <th>Fecha Nacimiento</th>
                    <th>Teléfono</th>
                    <th>Género</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente._id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.cedula}</td>
                      <td>{formatearFecha(cliente.fechaNacimiento)}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.genero}</td>
                      <td>{formatearFecha(cliente.fechaRegistro)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModalEditar(cliente)}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarCliente(cliente._id)}
                            className="bg-red-200 hover:bg-red-300 px-3 py-1 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cliente (sin cambios) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalEdicion ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {modalEdicion ? 'Actualizar' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutAdmin>  )
}

export default ClientesAdmin
