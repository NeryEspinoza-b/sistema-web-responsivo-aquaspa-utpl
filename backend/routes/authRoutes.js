const express = require("express")
const authRoutes = express.Router()
const {
  registerSchema,
  loginSchema,
  resendOtpSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  actualizarPerfilSchema,
  actualizarEstadoReservaSchema, 
  editarClienteSchema, 
  eliminarClienteSchema,
  filtrosReservaSchema
} = require('../shemas/authShemas.js')

const {register, login, resendOtp, verificarOtp, miPerfil, miPerfilActualizar, forgotPassword, datosPerfil, resetPasswordToken, logout, verificarSesion, estadisticasDashboardAdmin, consultaReservaClientes, consultaReservasClientesAdmin, consultarReservasConFiltros, actualizarEstadoReserva, obtenerDatosClientesAdmin, editarClientesAdmin, eliminarClientesAdmin} = require('../controllers/authController.js')
const validarZod = require('../middleware/validarZod.js')
{/* Rutas de autenticación de Usuario /*/}

//Ruta de registro de usuario
authRoutes.post("/register", validarZod(registerSchema), register)

//Ruta para iniciar sesión 
authRoutes.post("/login", validarZod(loginSchema), login)

//Ruta para reenviar codigo OTP
authRoutes.post('/resendOtp', validarZod(resendOtpSchema), resendOtp)

//Ruta para verificar codigo OPT
authRoutes.post('/verify-otp', validarZod(otpSchema), verificarOtp )

//Ruta para buscar y enviar token para restablecer contraseña
authRoutes.post('/forgot-password', validarZod(forgotPasswordSchema), forgotPassword)

//Ruta para resetear la contraseña mediante el token
authRoutes.post('/reset-password/:token', validarZod(resetPasswordSchema), resetPasswordToken)

//Ruta para cerrar sesión del usuario
authRoutes.post('/logout', logout )

//Ruta para verificar sesión del usuario
authRoutes.get('/verificar-sesion', verificarSesion)


// -------------------------------------------------------------------
{/* Rutas del cliente */}

//Ruta para obtener datos del perfil del usuario | rol user
authRoutes.get("/mi-perfil", miPerfil)

//Ruta para actualizar datos del usuario | rol user
authRoutes.put("/mi-perfil", validarZod(actualizarPerfilSchema), miPerfilActualizar )

//Ruta para obtener datos del usuario nombre y email 
authRoutes.get('/datos', datosPerfil)


// -------------------------------------------------------
{/* Rutas del Administrador */}

//Obtener estadísticas del dashboard para el administador 
authRoutes.get('/admin/estadisticas', estadisticasDashboardAdmin )

//Obtener todas las reservas realizadas por el cliente
authRoutes.get('/admin/consulta', consultaReservaClientes )

//Obtener reservas recientes
authRoutes.get('/admin/reservas-recientes', consultaReservasClientesAdmin)

//Obtener todas las reservas (con filtros opcionales)
authRoutes.get('/admin/reservas', validarZod(filtrosReservaSchema), consultarReservasConFiltros)

//Actualizar el estado de la reserva
authRoutes.put('/admin/reservas/:id/estado', validarZod(actualizarEstadoReservaSchema), actualizarEstadoReserva)

//Gestionar clientes
authRoutes.get('/admin/usuarios', obtenerDatosClientesAdmin)

//Editar clientes
authRoutes.put('/admin/usuarios/editar/:id', validarZod(editarClienteSchema), editarClientesAdmin)

//Eliminar clientes
authRoutes.delete('/admin/usuarios/eliminar/:id', validarZod(eliminarClienteSchema), eliminarClientesAdmin)


module.exports = authRoutes
