// Elimina los operadores peligrosos que son utilizados en inyecciones NoSQL
const sanitizeNoSql = (obj) => {
  if (!obj || typeof obj !== 'object') return

  for (const key in obj) {
    // Elimina los operadores de MongoDB $ .
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key]
    } 
    // Revisión recursiva de envio de datos para detectar ataques anidados dentro de objetos
    else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeNoSql(obj[key])
    }
  }
}

// Middleware de Express
const sanitizarNoSql = (req, res, next) => {
  sanitizeNoSql(req.body)
  sanitizeNoSql(req.params)
  sanitizeNoSql(req.query)

 console.log('Query sanitizada:', req.query)

  next()
}

module.exports = sanitizarNoSql
