const Usuario = require("../models/authModel.js")
const Reserva = require('../models/Reserva.js')
const Servicio = require('../models/servicesModel.js')

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const crypto = require('node:crypto')

const verificarToken = require('../middleware/verificarToken.js')
const verificarRol = require('../middleware/verificarRol.js')

const {enviarCorreo} = require('../middleware/enviarCorreo.js')

//Controlador de registro de usuario
exports.register = async (req, res) => {
  const { email, password, nombre, telefono, cedula, fechaNacimiento, genero, direccion } =
    req.body

  try {
    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario)
      return res.status(403).json({ msg: "El usuario ya esta en uso" })

    const hassedPassword = bcrypt.hashSync(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    let fechaNac = null
    if(fechaNacimiento) {
      fechaNac = new Date(fechaNacimiento)
      fechaNac.setUTCHours(0,0,0,0)
    }
// Funcionalidad para utilizar la api de nomitatim y guardar datos de locaticacion
    let ubicacion =  null
    if(direccion){
    try {
     const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            direccion
          )}`,
          {
            headers: { "User-Agent": "spa-system/1.0 (alexander@hotmail.com)" }
          }
        )
        const data = await response.json()
        if (data.length > 0) {
          ubicacion = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          }
        }
      } catch (error) {
        console.error('Error en obtener las coordenadas', error)
      }
    }
    
    let newUsuario = new Usuario({
      email,
      password: hassedPassword,
      nombre,
      telefono,
      cedula,
      fechaNacimiento: fechaNac,
      genero,
      direccion,
      ubicacion,
      otp,
      otpExpires
    })

    await newUsuario.save()
// Envío de codigo de verificicación
    if (newUsuario?.email) {
      const envioEmail = 
        `<h1> Bienvenido al Sistema de SPA </h1>
         <p> Estimado ${newUsuario.email}, verifica tu cuenta </p> 
         <p> Ingresa el siguiente codigo de verificación: ${otp} </p> 
         <p> Gracias por utilzar nuestros servicios</p> 
        `
        await enviarCorreo(newUsuario.email, "Codigo de verificación", envioEmail
      )
    }

    return res.status(201).json({ msg: "Usuario registrado con exito", code: otp })
  } catch (error) {
    console.error("Error en el registro", error)
    res.status(500).json({ msg: "Error en el registro", error })
  }
}

//Controlador de login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const existeUsuario = await Usuario.findOne({ email })    
    const verifyPassword =  existeUsuario && (await bcrypt.compare(password, existeUsuario.password))
    if (!existeUsuario || !verifyPassword) return res.status(404).json({ msg: "Credenciales incorrectas" })
      if(!existeUsuario.isVerified) return res.status(401).json({msg: 'Tu cuenta no esta verificada. Por favor revisa tu correo', noVerificado: true})
    
    const token = jwt.sign({id: existeUsuario._id, email: existeUsuario.email, rol: existeUsuario.rol}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.cookie('tokenSesion', token, {
      httpOnly: true, 
      secure: false, 
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ msg: "Inicio de sesión exitoso", token, rol: existeUsuario.rol })
  } catch (error) {
    console.error("Error en el inicio de sesión", error)
    res.status(500).json({ msg: "Error en el inicio de sesión", error })
  }
}

//Controlador de reenvío de código OTP al usuario
exports.resendOtp = async (req, res) => {
  const {email} = req.body
  try {
    const existeUsuario = await Usuario.findOne({email})
    if(!existeUsuario) return res.status(404).json({msg: 'Usuario no encontrado'})
    if(existeUsuario.isVerified) return res.status(400).json({msg: 'Usuario ya verificado'})
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    existeUsuario.otp = otp
    existeUsuario.otpExpires = otpExpires
    await existeUsuario.save()

    const mensajeHTML = `
      <h1> Nuevo codigo de confirmación de registro de correo <h1/>
      <p>Estimado usuario ${email} su nuevo codigo de confirmacion es: ${otp} </p>
      <p> Gracias por usar nuestros servicios </p>
    `
    await enviarCorreo(email, "Nuevo codigo de confirmación de registro", mensajeHTML)
    return res.status(201).json({msg: 'Codigo enviado correctamente'})
  } catch (error) {
    console.error('Error en el envio del correo de confirmación', error)
    res.status(500).json({msg: 'Error en el envio del correo de confirmación', error})
  }
}

//Controlador de verificar código OTP
exports.verificarOtp = async (req, res) => {
    const {email, otp} = req.body
    try {
    const existeUsuario = await Usuario.findOne({email})
    if(!existeUsuario) return res.status(404).json({msg: 'Usuario no encontrado'})
    if(existeUsuario.isVerified) return res.status(400).json({msg: 'El usuario ya esta verificado'})
    if(existeUsuario.otp !== otp) return res.status(400).json({msg: 'El codigo introducido es incorrecto'})
      
    if(existeUsuario.otpExpires < new Date()) return res.status(400).json({msg: 'El codigo ha expirado'})
    
    existeUsuario.isVerified = true, 
    existeUsuario.otp = undefined, 
    existeUsuario.otpExpires = undefined

    await existeUsuario.save()
    return res.status(200).json({msg: "Correo verificado correctamente"})
      
    } catch (error) {
      console.error('Error en la verificación del codigo', error)
      res.status(500).json({msg: 'Error en la verificación del codigo', error})
    }
}

//Controlador de obtener datos del usuario
exports.miPerfil =  [verificarToken, async (req, res) => {
  const usuarioID = req.user.id
  try {
    const usuario = await Usuario.findById(usuarioID)  
    if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})
    res.status(200).json(usuario)
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: 'Error en recuperar los datos del usuario', error})
  }
}]

//Controlador para actualizar datos del usuario
exports.miPerfilActualizar = [verificarToken, async (req, res) => {
  const usuarioID = req.user.id
  console.log(usuarioID)
  try {
    const datos = req.body
    const usuario = await Usuario.findByIdAndUpdate(usuarioID, datos, { new: true })

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" })

    res.json({ msg: "Perfil actualizado correctamente", usuario })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al actualizar perfil" })
  }
}]

//Controlador de recuperar contraseña del usuario
exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    // Generar token para establecerlo en el enlace 
    const token = crypto.randomBytes(32).toString('hex')
    usuario.tokenContrasena = token
    usuario.tokenContrasenaExpires = Date.now() + 1000 * 60 * 15 // 15 min
    await usuario.save()

    // Creación de link de restablecimiento
    const link = `http://localhost:5173/restablecer-password/${token}`
    
    // Enviar correo electronico
    if(usuario?.email){
      const mensajeHTML = `
      <h1> Recuperación de contraseña</h1>
      <p >Has solicitado restablecer tu contraseña </p>
      <p>Por favor, haz clic en el siguiente enlace para el restablecimiento de tu contraseña</p>
      <a href="${link}"> Restablecer contraseña </a>
      <p> Este enlace expira en 15 minutos. </p>
    `
    await enviarCorreo(usuario.email, 'Restablecer contraseña', mensajeHTML )
    }
    res.status(201).json({ msg: 'Enlace de recuperación enviado' })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', err })
  }
}

//Controlador para recuperar solamente nombre y email del del usuario
exports.datosPerfil = [verificarToken,  async (req, res) => {
  const usuarioID = req.user.id
  try {
    const existeUsuario = await Usuario.findById(usuarioID).select("nombre email")
    if(!existeUsuario) return res.status(404).json({msg: 'Usuario no encontrado'})
    return res.status(200).json(existeUsuario)
  } catch (error) {
    console.error('Error al traer los datos del usuario', error)
    res.status(500).json({msg: 'Error al traer los datos del usuario', error})
  }
}]

//Controlador de establecer nueva contraseña
exports.resetPasswordToken = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  try {
    const usuario = await Usuario.findOne({
      tokenContrasena: token,
      tokenContrasenaExpires: { $gt: Date.now() }
    })

    if (!usuario) {
      return res.status(400).json({ msg: 'Token inválido o expirado' })
    }

    // Guardar nueva contraseña (con hash)
    usuario.password = await bcrypt.hash(password, 10)
    usuario.tokenContrasena = undefined
    usuario.tokenContrasenaExpires = undefined
    await usuario.save()
    res.json({ msg: 'Contraseña restablecida con éxito' })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

//Controlador de cerrar sesión
exports.logout = [verificarToken, (req, res) => {
  try {
    res.cookie('tokenSesion', '', {
      httpOnly: true, 
      secure: false, 
      sameSite: 'strict', 
      expires: new Date(0)
    })
    return res.status(200).json({msg: 'Sesión cerrada correctamente'})
  } catch (error) {
    console.error('Error en cerrar la sesión del usuario', error)
    res.status(500).json({msg: 'Error en cerrar la sesión del usuario', error})
  }
}]

//Controlador de para verificar si existe sesión activa
exports.verificarSesion = [verificarToken, (req, res) => {  
  return res.status(200).json({user: req.user})
}]

//Controlador de estadisticas en dashboard de admin
exports.estadisticasDashboardAdmin = [verificarToken, verificarRol, async (req, res) => {
  try {
    //Total de reservas
    const totalReservas = await Reserva.countDocuments()

    //Total de clientes
    const clientes = await Usuario.countDocuments({ rol: 'user' })

    // Servicios activos
    const serviciosActivos = await Servicio.countDocuments()

    res.json({
      totalReservas,
      clientes,
      serviciosActivos
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}]

//Controlador de consultar reservas de usuarios por usuarios
exports.consultaReservaClientes = [verificarToken, verificarRol, async (req, res) => {
    try {
      const existeReserva = await Reserva.find().populate('usuarioId').populate('servicioId').sort({creadaEn:-1}).limit(5)
      if(!existeReserva) return res.status(404).json({msg: 'No existe reservas'})
      return res.status(200).json(existeReserva)
    } catch (error) {
      console.error('Error en la consulta de reservas', error)
      res.status(500).json({msg:'Error en la consulta de las reservas', error})
    }
}]

//Controlador de consultar reservas de usuarios
exports.consultaReservasClientesAdmin = [verificarToken, verificarRol, async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({creadaEn: -1})
      .populate('servicioId')
      .populate('usuarioId', 'email nombre')
      
    console.log(reservas)
    return res.json(reservas)
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]

//Controlador de consultar reservas con filtros de busqueda
exports.consultarReservasConFiltros = [verificarToken, verificarRol, async (req, res) => {
  try {
    const { estado, fecha } = req.query
    const filtro = {}

    if (estado) filtro.estado = estado
    if (fecha) {
      const inicio = new Date(fecha)
      inicio.setHours(0, 0, 0, 0)
      const fin = new Date(fecha)
      fin.setHours(23, 59, 59, 999)
      filtro.fecha = { $gte: inicio, $lte: fin }
    }

    const reservas = await Reserva.find(filtro)
      .populate('servicio')
      .populate('usuario')
      .sort({ fecha: -1 })

    res.json(reservas)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]

//Controlador de actualizar el estado de la reserva
exports.actualizarEstadoReserva = [ verificarToken, verificarRol, async (req, res) => {
  try {
    const { estado } = req.body
    const reserva = await Reserva.findById(req.params.id).populate('usuarioId', 'nombre email').populate('servicioId', 'nombre')

    if (!reserva) {
      return res.status(404).json({ msg: 'Reserva no encontrada' })
    }

    reserva.estado = estado
    await reserva.save()

    // funcionalidad de enviar el correo al usuario 
    const {nombre, email} = reserva.usuarioId
    const servicio = reserva.servicioId.nombre
    const fechaHora = reserva.fechaHora

    // formateamos la fecha
    const fechaFormateada = fechaHora.toLocaleDateString('es-EC', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    })

    // formateamos la hora
    const horaFormateada = fechaHora.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit' 
    })

    // Variables para almacenar de acuerdo lo que hace el administrador
    let asunto = ''
    let mensajeHTML = ''

    if(estado === 'confirmada'){
      asunto = 'Cita Confirmada - AquaSPA'
      mensajeHTML = `
          <h2>Confirmación de Cita</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Tu cita ha sido <strong>confirmada</strong> por el administrador.</p>
          <ul>
            <li><strong>Servicio:</strong> ${servicio}</li>
            <li><strong>Fecha:</strong> ${fechaFormateada}</li>
            <li><strong>Hora:</strong> ${horaFormateada}</li>
          </ul>
          <p>Te esperamos en AquaSPA.</p>
      `
    }

    if(estado === 'cancelada'){
        asunto = 'Cita cancelada por el establecimiento de AquaSPA'
        mensajeHTML = `        
          <h2>Cita cancelada</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Te informamos que tu cita ha sido <strong>cancelada</strong> por el establecimiento.</p>
          <ul>
            <li><strong>Servicio:</strong> ${servicio}</li>
            <li><strong>Fecha:</strong> ${fechaFormateada}</li>
            <li><strong>Hora:</strong> ${horaFormateada}</li>
          </ul>
          <p>Puedes ponerte en contacto con nosotros para más información.</p>
        `
    }

    if(asunto && mensajeHTML){
      await enviarCorreo(email, asunto, mensajeHTML)
    }
    res.json({ msg: 'Estado actualizado', reserva })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}]

//Controlador de obtener datos de usuarios menos el password
exports.obtenerDatosClientesAdmin = [verificarToken, verificarRol, async (req, res) => {
  try {
    const existeUsuario = await Usuario.find({rol: 'user'}).select('-password')
    if(!existeUsuario) return res.status(404).json({msg: 'No existen usuarios'})
    return res.status(200).json(existeUsuario)
  } catch (error) {
    console.error('Error al consultar los usuarios', error)
    res.status(500).json({msg: 'Error al consultar los usuarios', error})
  }
}]

//Controlador de editar usuarios
exports.editarClientesAdmin = [ verificarToken, verificarRol, async (req, res) => {
  const {id} = req.params
  const {nombre, email, telefono, cedula, fechaNacimiento, direccion, genero} = req.body

  try {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) return res.status(404).json({ msg: 'Usuario no encontrado' })

    // Asignar los valores recibidos directamente
    if(nombre !== undefined) existeUsuario.nombre = nombre
    if(email !== undefined) existeUsuario.email = email
    if(telefono !== undefined) existeUsuario.telefono = telefono
    if(cedula !== undefined) existeUsuario.cedula = cedula
    if(fechaNacimiento !== undefined) existeUsuario.fechaNacimiento = fechaNacimiento
    if(direccion !== undefined) existeUsuario.direccion = direccion
    if(genero !== undefined) existeUsuario.genero = genero

    await existeUsuario.save()
    return res.status(200).json({ msg: 'Datos actualizados correctamente' })
    
  } catch (error) {
    console.error('Error al editar el usuario', error)
    res.status(500).json({ msg: 'Error al editar el usuario', error })
  }
}]

//Controlador de eliminar usuarios
exports.eliminarClientesAdmin = [verificarToken, verificarRol, async (req, res) => {
  const {id} = req.params
  try {
    const existeUsuario = await Usuario.findByIdAndDelete(id)
    if(!existeUsuario) return res.status(404).json({msg: 'Usuario no encontrado'})
    return res.status(200).json({msg: 'Usuario eliminado correctamente'})
  } catch (error) {
    console.error('Error al eliminar el usuario', error)
    res.status(500).json({msg: 'Error al eliminar el usuario', error})
  }
}]