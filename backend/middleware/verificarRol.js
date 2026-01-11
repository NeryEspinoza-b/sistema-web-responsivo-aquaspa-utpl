const verifyRol = (req, res, next) => {
  try {
    const rolUsuario = req.user.rol

    if (rolUsuario !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Solo administradores.' })
    }
    //Si el rol es 'admin', continúa con la siguiente función middleware o ruta
    next()
  } catch (error) {
    console.error('Error en verificar el usuario', error)
    res.status(500).json({ msg: 'Error en verificar el usuario', error })
  }
}


module.exports = verifyRol