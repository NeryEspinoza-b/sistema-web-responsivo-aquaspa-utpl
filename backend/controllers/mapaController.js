const Usuario = require("../models/authModel.js")
const verificarToken = require('../middleware/verificarToken.js')
const verificarRol = require("../middleware/verificarRol.js")

exports.clientesMapa = [verificarToken, verificarRol, async (req, res) => {
  try {
    const clientes = await Usuario.find(
      {ubicacion: { $exists: true } },
      "nombre email direccion ubicacion"
    )
    const conteoCiudades = {}
    clientes.forEach((c) => {
        const ciudad = c.direccion || "Sin dirección"
        conteoCiudades[ciudad] = (conteoCiudades[ciudad] || 0) + 1
    })

    const resumenCiudades = {}
    clientes.forEach((c) => {
      const ciudad = c.direccion || "Sin dirección"
      resumenCiudades[ciudad] = (resumenCiudades[ciudad] || 0) + 1
    })

    res.json({ clientes, resumenCiudades })
  } catch (error) {
    console.error("Error obteniendo clientes:", error)
    res.status(500).json({ msg: "Error al obtener los clientes" })
  }
}]