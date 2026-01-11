const { z } = require('zod')

// Se valida los datos de entrada para la creación de una reserva
const crearReservaSchema = z.object({
  body: z.object({

    servicioId: z.string({ required_error: "El servicio es obligatorio" })
      .min(1, "El servicio es obligatorio"),      

    fecha: z.string({ required_error: "La fecha es obligatoria" })
      .min(1, "La fecha es obligatoria")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha es inválido (YYYY-MM-DD)"),

    hora: z.string({ required_error: "La hora es obligatoria" })
      .min(1, "La hora es obligatoria")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)")

  })
})

// Valicación para cancerlar la reserva por el id
const cancelarReservaSchema = z.object({
  params: z.object({
    reservaId: z.string({ required_error: "El ID de la reserva es obligatorio" })
      .min(1, "El ID de la reserva es obligatorio")
  })
})

// validar de reservas ocupadas
const reservasOcupadasSchema = z.object({
  query: z.object({
    fecha: z.string({ required_error: "La fecha es obligatoria" })
      .min(1, "La fecha es obligatoria")
  })
})

module.exports = {
  crearReservaSchema,
  cancelarReservaSchema,
  reservasOcupadasSchema
}
