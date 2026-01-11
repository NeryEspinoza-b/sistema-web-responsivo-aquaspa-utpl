const rateLimit = require('express-rate-limit')

const limiteDeSolicitudes = rateLimit({
    windowMs: 15 * 60 * 1000,       // Tiempo de volver a intentar dentro de 15 min
    max: 100,                        // Permitido 100 peticiones máximas por IP
    standardHeaders: true,          // devuelve la información en el header estandar
    legacyHeaders: false,           // desactiva los headers antiguos
    message: {
        msg: 'Has realizado demasiadas peticiones desde tu IP, por favor inténtalo nuevamente más tarde'
    }

})


module.exports = limiteDeSolicitudes