//creamos el shema de validación para los body, params y querys
const validarSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  })
// Si se captura un error se presenta el status 404 y el mensaje y se procede a presentar los errores
//encontrados
  if (!result.success) {
    return res.status(400).json({
      msg: 'Error en la validación',
      errores: result.error.issues.map(issue => ({
        campo: issue.path.join('.'),
        mensaje: issue.message
      }))
    })
  }

  next()
}

module.exports = validarSchema
