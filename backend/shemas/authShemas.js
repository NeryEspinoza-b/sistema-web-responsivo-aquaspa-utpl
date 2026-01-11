const { z } = require('zod')

// validación del registro del usuario
const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "El correo electrónico es obligatorio" })
      .email("El correo electrónico es inválido")
      .transform(v => v.toLowerCase().trim()),

    password: z.string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),

    nombre: z.string({ required_error: "El nombre completo es obligatorio" })
      .min(3, "El nombre debe tener mínimo 3 caracteres")
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras"),

    telefono: z.string({ required_error: "El teléfono es obligatorio" })
      .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

    cedula: z.string({ required_error: "La cédula es obligatoria" })
      .regex(/^[0-9]{10}$/, "La cédula debe tener 10 dígitos y numéricos"),

    fechaNacimiento: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),

    genero: z.enum(
      ["Masculino", "Femenino", "Otro"],
      { required_error: "El género es obligatorio" }
    ),

    direccion: z.string()
      .min(3, "La dirección es muy corta")
      .max(50, "La dirección es demasiado larga")
      .optional()
  })
})

// Inicio de sesión del usuario
const loginSchema = z.object({
  body: z.object({

    email: z
      .string({ required_error: "El correo electrónico es obligatorio" })
      .email("El correo electrónico es inválido"),

    password: z
      .string({ required_error: "La contraseña es obligatoria" })
  })
})

// Verificar la cuenta mediante el código otp al usuario
const otpSchema = z.object({
  body: z.object({

    email: z.string({ required_error: "El correo electrónico es obligatorio" })
      .email("El correo electrónico no es válido"),

    otp: z
      .string({ required_error: "El código OTP es obligatorio" })
      .regex(/^[0-9]{6}$/, "El código OTP debe tener 6 dígitos numéricos")
  })
})

// Reenviar el código OTP
const resendOtpSchema = z.object({
  body: z.object({

    email: z.string({ required_error: "El correo electrónico es obligatorio" })
      .email("El correo electrónico no es válido")
  })
})

// Verificar el email si existe del usuario
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "El correo electrónico es obligatorio" })
      .email("El correo electrónico no es válido")
  })
})

// Restablecer la password
const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string({ required_error: "El token es obligatorio" })
      .min(10, "El token es inválido")
  }),
  body: z.object({
    password: z.string({ required_error: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
  })
})

//Actualizar el perfil del usuario
const actualizarPerfilSchema = z.object({
  body: z.object({

    nombre: z.string().min(3, "El nombre debe tener mínimo 3 caracteres").optional(),
    email: z.string().email("El correo electrónico es inválido").optional(),
    telefono: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos").optional(),
    cedula: z.string().regex(/^[0-9]{10}$/, "La cédula debe tener 10 dígitos y numéricos").optional(),
    fechaNacimiento: z.string().optional(),
    direccion: z.string().optional(),
    genero: z.enum(["Masculino", "Femenino", "Otro"]).optional()
  })
})

// Actualizar estado reserva (admin)
const actualizarEstadoReservaSchema = z.object({
  params: z.object({

    id: z
      .string({ required_error: "El ID de la reserva es obligatorio" })
      .min(1, "El ID de la reserva es inválido")
  }),
  body: z.object({

    estado: z.enum(
      ["pendiente", "confirmada", "cancelada", "completada"],
      { required_error: "El estado de la reserva es obligatorio" }
    )
  })
})

// Validar filtros de reserva
const filtrosReservaSchema = z.object({
  query: z.object({

    estado: z
      .enum(["pendiente", "confirmada", "cancelada", "completada"])
      .optional(),

    fecha: z.string().optional()
  })
})

// validar para editar clientes
const editarClienteSchema = z.object({
  params: z.object({

    id: z.string({ required_error: "El ID del cliente es obligatorio" })
      .min(1, "El ID del cliente es inválido")
  }),
  body: z.object({
    nombre: z.string().min(3, "El nombre debe tener mínimo 3 caracteres")
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras").optional(),

    telefono: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos").optional(),

    cedula: z.string().regex(/^[0-9]{10}$/, "La cédula debe tener 10 dígitos y numéricos").optional(),

    fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
    
    direccion: z.string().min(3, "La dirección es muy corta").max(50, "La dirección es demasiado larga").optional(),
    
    genero: z.enum(["Masculino", "Femenino", "Otro"]).optional()
  })
})

// Validar para el id de eliminar el cliente
const eliminarClienteSchema = z.object({
  params: z.object({

    id: z
      .string({ required_error: "El ID del cliente es obligatorio" })
      .min(1, "El ID del cliente es inválido")
  })
})

module.exports = {
  registerSchema,
  loginSchema,
  otpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  actualizarPerfilSchema,
  actualizarEstadoReservaSchema,
  filtrosReservaSchema,
  editarClienteSchema,
  eliminarClienteSchema
}
