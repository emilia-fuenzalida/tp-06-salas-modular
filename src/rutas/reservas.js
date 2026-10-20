const express = require("express");

const {
  listarReservas,
  mostrarFormulario,
  mostrarDetalle,
  crearReserva,
} = require("../controladores/reservas");

const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

const reservasRouter = express.Router();

reservasRouter.use(prepararAreaReservas);

reservasRouter.get("/", listarReservas);
reservasRouter.get("/nueva", mostrarFormulario);
reservasRouter.get("/:id", mostrarDetalle);
reservasRouter.post("/", validarReserva, crearReserva);

module.exports = reservasRouter;
