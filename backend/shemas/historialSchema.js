const { z } = require('zod')

//Schema de validación para crear el historial clinico del cliente
const crearHistorialSchema = z.object({
  body: z.object({

    usuarioId: z.string({ required_error: "El usuario es obligatorio" })
      .min(1, "El usuario es obligatorio"),

    tratamiento: z.string({ required_error: "El tratamiento es obligatorio" })
      .min(3, "El tratamiento debe tener al menos 3 caracteres"),

    observaciones: z.string().optional(),
    recomendaciones: z.string().optional()
  })
})

//Schema de validación para obtener el historial del cliente
const historialClienteSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "El ID del cliente es obligatorio" })
      .min(1, "El ID del cliente es obligatorio")
  })
})

//Shema de validación para actualizar el historial del cliente
const actualizarHistorialSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "El ID del historial es obligatorio" })
      .min(1, "El ID del historial es obligatorio")
  }),
  body: z.object({
    tratamiento: z.string().optional(),
    observaciones: z.string().optional(),
    recomendaciones: z.string().optional()
  })
})

//Shema de validación para eliminar el historial clinico
const eliminarHistorialSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "El ID del historial es obligatorio" })
      .min(1, "El ID del historial es obligatorio")
  })
})

module.exports = {
  crearHistorialSchema,
  historialClienteSchema,
  actualizarHistorialSchema,
  eliminarHistorialSchema
}
