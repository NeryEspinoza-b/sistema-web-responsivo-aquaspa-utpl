import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginUsuario from './auth/LoginUsuario'
import RegistroUsuario from './auth/RegistroUsuario'
import EnlaceEmailPassword from './auth/EnlaceEmailPassword'
import RevisarEmailPassword from './auth/RevisarEmailPassword'
import VerificarEmailRegistro from './auth/VerificarEmailRegistro'
import RestablecerPassword from './auth/RestablecerPassword'
import Home from './client/Home'
import DashboardCliente from './client/dashboardCliente'
import Servicios from './client/Servicios'
import ReservarCita from './client/ReservarCita'
import MisCitas from './client/MisCitas'
import MiPerfil from './client/PerfilCliente'
import ReservasAdmin from './admin/ReservasAdmin'
import ClientesAdmin from './admin/ClientesAdmin'
import ServiciosAdmin from './admin/ServiciosAdmin'
import HistorialClinico from './admin/HistorialClinico'
import MapaClientes from './admin/MapaClientes'
import ReportesAdmin from './admin/ReportesAdmin'
import RutasPrivadas from '../components/RutasPrivadas'
import AccesoNoAutorizado from './auth/AccesoNoAutorizado'
function App() {
  return (
    <Router>
      <Routes>
         {/* Rutas públicas de auth*/}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginUsuario />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/recuperar-password" element={<EnlaceEmailPassword />} />
        <Route path="/revisar-email-password" element={<RevisarEmailPassword />} />
        <Route path="/restablecer-password/:token" element={<RestablecerPassword />} />
        <Route path="/verificar-email-registro" element={<VerificarEmailRegistro />} />
        
         {/* Rutas del cliente */}
        <Route path='/dashboard' element={
          <RutasPrivadas rolesPermitidos={["user"]}>
            <DashboardCliente/>
          </RutasPrivadas>
          } />
        <Route path='/servicios' element={
          <RutasPrivadas rolesPermitidos={["user"]}>
            <Servicios/>
          </RutasPrivadas>
          } />
        <Route path='/reservar-cita' element={
          <RutasPrivadas rolesPermitidos={["user"]}>
            <ReservarCita/>  
          </RutasPrivadas>
          }/>
        <Route path='/mis-citas' element={
          <RutasPrivadas rolesPermitidos={["user"]}>
            <MisCitas/>  
          </RutasPrivadas>
          }/>
        <Route path='/mi-perfil' element={
          <RutasPrivadas rolesPermitidos={["user"]}>
            <MiPerfil/>
          </RutasPrivadas>
          }/>
          
        {/* Rutas del administrador */}
        <Route path='/reservas-admin' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <ReservasAdmin/>
          </RutasPrivadas>
          } />
        <Route path='/clientes-admin' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <ClientesAdmin/>
          </RutasPrivadas>
          } />
        <Route path='/servicios-admin' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <ServiciosAdmin/>
          </RutasPrivadas>
          } />
        <Route path='/historial-clinico' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <HistorialClinico/>
          </RutasPrivadas>
          } />
        <Route path='/reportes-admin' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <ReportesAdmin/>
          </RutasPrivadas>
          } />
        <Route path='/mapa-clientes' element={
          <RutasPrivadas rolesPermitidos={["admin"]}>
            <MapaClientes/>
          </RutasPrivadas>
          } />

         {/* Ruta no encontrada */}        
         <Route path='*' element={<h1 className='text-center text-2xl mt-20'>404  Página no encontrada</h1>}/>

         {/* Ruta Acceso no autorizado */}
         <Route path='/no-autorizado' element={<AccesoNoAutorizado/>}/>
      </Routes>
    </Router>
  )
}

export default App