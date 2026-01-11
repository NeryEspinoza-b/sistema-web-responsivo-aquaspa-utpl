const agenda = require("../config/agenda")
const { enviarCorreo } = require("../middleware/enviarCorreo")

// Definimos la tarea de enviar recordatorios
agenda.define("Enviar recordatorio de reserva", async (job) => {
  const { correo, nombre, fecha, hora, servicio } = job.attrs.data

  //Establecemos el cuerpo del mensaje de recordatorio
  const mensaje = `
  <p> Hola ${nombre}, este es un recordatorio de tu cita en AquaSpa: </p>
  <p> Los detalles de tu cita agendada son los siguientes: </p>
      <ul>
        <li><strong>Servicio:</strong> ${servicio}</li>
        <li><strong>Fecha:</strong> ${fecha}</li>
        <li><strong>Hora:</strong> ${hora}</li>
      </ul>
  <p> Te esperamos. Recuerda llegar 10 minutos antes. </p> 
  `
  //Llamamos a nodemailer para el envío del correo
  await enviarCorreo(correo, "Recordatorio de cita - AquaSpa", mensaje)
  console.log("Recordatorio enviado a:", correo)
})
