const { z } = require('zod')

//Creamos el schema con sus validaciones de servicios
const crearServicioSchema = z.object({
  body: z.object({
    nombre: z.string({ required_error: "El nombre del servicio es obligatorio" })
      .min(3, "El nombre del servicio debe tener al menos 3 caracteres")
      .max(50, "El limite de palabras es 50"),

    descripcion: z.string({ required_error: "La descripción del servicio es obligatoria" })
      .min(5, "La descripción del servicio debe tener al menos 5 caracteres")
      .max(300, "El limite de palabras es 100"),

    precio: z.string({ required_error: "El precio del servicio es obligatorio" })
      .min(1, "El precio del servicio es obligatorio"),

    duracion: z.preprocess((val) => Number(val),
     z.number({
    required_error: "La duración del servicio es obligatoria",
    invalid_type_error: "La duración debe ser un número"
  }).min(1, "La duración del servicio debe ser mayor a 0")
)})
})

//Creamos el schema de validación para el id del servicio
const servicioIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "El ID del servicio es obligatorio" })
      .min(1, "El ID del servicio es obligatorio")
  })
})

//Schema de validación para la actualizacion del servicio
const actualizarServicioSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "El ID del servicio es obligatorio" })
      .min(1, "El ID del servicio es obligatorio")
  }),
  body: z.object({
    nombre: z.string().min(3, "El nombre del servicio debe tener al menos 3 caracteres")
      .max(50, "El limite de palabras es 50").optional(),
      
    descripcion: z.string().min(5, "La descripción del servicio debe tener al menos 5 caracteres")
      .max(300, "El limite de palabras es 100").optional(),
      
    precio: z.string().optional(),

    duracion: z.preprocess(
      (val) => val === undefined ? undefined : Number(val),
      z.number({
        invalid_type_error: "La duración debe ser un número"
      }).min(1, "La duración debe ser mayor a 0")
    ).optional()
  })
})


module.exports = {
  crearServicioSchema,
  servicioIdSchema,
  actualizarServicioSchema
}
