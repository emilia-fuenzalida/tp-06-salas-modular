const servicioReservas = require("../servicios/reservas");

const listarReservas = (req, res) => {
  res.render("reservas/lista", {
    title: "Reservas",
    reservas: servicioReservas.obtenerTodas(),
  });
};

const mostrarFormulario = (req, res) => {
  res.render("reservas/nueva", {
    title: "Nueva reserva",
    error: null,
    valores: {},
  });
};

const mostrarDetalle = (req, res) => {
  const reserva = servicioReservas.obtenerPorId(req.params.id);

  if (!reserva) {
    return res.status(404).render("no-encontrado", {
      titulo: "Reserva no encontrada",
      mensaje: "La reserva solicitada no existe.",
    });
  }

  res.render("reservas/detalle", {
    title: "Detalle de reserva",
    reserva,
  });
};

const crearReserva = (req, res) => {
  servicioReservas.crear(req.reservaValidada);

  res.redirect("/reservas");
};

module.exports = {
  listarReservas,
  mostrarFormulario,
  mostrarDetalle,
  crearReserva,
};
