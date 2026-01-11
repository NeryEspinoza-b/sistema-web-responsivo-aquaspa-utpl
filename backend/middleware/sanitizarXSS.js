// Permite limpiar las etiquetas HTML y scripts
const sanitizeXSS = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  if (typeof value === 'object' && value !== null) {
    for (const key in value) {
      value[key] = sanitizeXSS(value[key])
    }
  }
  return value
}

// Middleware de Express
const sanitizarXSS = (req, res, next) => {
  req.body = sanitizeXSS(req.body)
  req.params = sanitizeXSS(req.params)
  req.query = sanitizeXSS(req.query)
    console.log('Body sanitizado:', req.body)
  next()
}

module.exports = sanitizarXSS
