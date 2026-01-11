require('dotenv').config()
const Agenda = require("agenda")

const agenda = new Agenda({
  db: { 
    address: process.env.MONGO_URI, 
    collection: "agendaJobs" 
  }
})

//Iniciamos Agenda
agenda.on("ready", () => {
  console.log("Agenda.js se encuentra correctamente conectada y lista para ser utilizada");
  agenda.start();
})

//Manejamos los posibles errores que se generen
agenda.on("error", (err) => {
  console.error("Error en Agenda.js:", err);
})

module.exports = agenda;
