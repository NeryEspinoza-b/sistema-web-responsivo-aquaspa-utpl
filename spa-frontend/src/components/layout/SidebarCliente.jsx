import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../../assets/spa.png'
import axios from "axios"
function Sidebar({ desktop = false }) {
  const [open, setOpen] = useState(false)

  // Si es dispositivo desktop, solo renderiza el menú normal
  if (desktop) {
    return (
      <div className="w-64 bg-green-50 min-h-screen border-r border-green-200">
        <SidebarContent />
      </div>
    )
  }

  // Versión para dispositivos móviles
  return (
    <>
      {/* Botón tipo hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 text-green-600 fixed top-2 left-2 z-50 bg-white rounded-md shadow"
      >
        ☰
      </button>

      {/* Fondo trasnparente */}
      {open && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar de dispositivos moviles */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-64 
        bg-green-50 min-h-screen border-r border-green-200 z-50`}
      >
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </div>
    </>
  )
}

function SidebarContent({ onLinkClick }) {
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const {data} = await axios.post('http://localhost:5000/auth/logout',{}, {
        withCredentials: true
      })
      
        alert(data.msg || 'Sesión cerrada')
        if(onLinkClick) onLinkClick()
        navigate('/')     

    } catch (error) {
      console.error('Error al cerrar la sesión', error)
      const data = error?.response?.data
      alert(data.msg || 'Error en cerrar la sesión')
    }
  }

  return (
    <>
      {/* Logo y título */}
      <div className="p-6 border-b border-green-200">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo establecimiento SPA"
            title="Logo establecimiento"
            className="w-14 h-14"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">AquaSpa</span>
            <p className="text-sm text-gray-600">Centro de Bienestar</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          NAVEGACIÓN
        </h3>
        <nav className="space-y-1">
          <Link
            to="/dashboard"
            onClick={onLinkClick}
            className="text-gray-700 hover:bg-green-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Mi SPA
          </Link>
          <Link
            to="/servicios"
            onClick={onLinkClick}
            className="text-gray-700 hover:bg-green-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Servicios
          </Link>
           <Link
            to="/reservar-cita"
            onClick={onLinkClick}
            className="text-gray-700 hover:bg-green-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Reservar Cita
          </Link>
          <Link
            to="/mis-citas"
            onClick={onLinkClick}
            className="text-gray-700 hover:bg-green-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Mis Citas
          </Link>
          <Link
            to="/mi-perfil"
            onClick={onLinkClick}
            className="text-gray-700 hover:bg-green-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Mi Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
