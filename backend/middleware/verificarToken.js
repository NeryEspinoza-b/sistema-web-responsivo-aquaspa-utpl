const jwt = require('jsonwebtoken')
const verificarToken = (req, res, next ) => {
    const token = req.cookies.tokenSesion
    if(!token) return res.status(402).json({msg: 'Acceso denegado, no existe token'})
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        console.error('Token invalido o expirado', error)
        res.status(401).json({msg: 'Token invalido o expirado', error})
    }
}

module.exports = verificarToken