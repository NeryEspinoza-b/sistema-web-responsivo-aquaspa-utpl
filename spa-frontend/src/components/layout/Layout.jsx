import Sidebar from "./SidebarCliente"

function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar en escritorio */}
      <div className="hidden md:block w-64 bg-green-50 border-r border-green-200">
        <Sidebar desktop />
      </div>

      {/* Sidebar en dispositivos móviles */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Contenido principal con scroll */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
