const servicioReservas = require("../servicios/reservas");

const prepararAreaReservas = (req, res, next) => {
  res.locals.seccion = "Reservas de salas";
  next();
};

const validarReserva = (req, res, next) => {
  const estudiante = (req.body.estudiante || "").trim();
  const email = (req.body.email || "").trim();
  const sala = (req.body.sala || "").trim();
  const fecha = (req.body.fecha || "").trim();
  const turno = (req.body.turno || "").trim();
  const personas = Number(req.body.personas);

  const valores = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: req.body.personas || "",
  };

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    req.body.personas === ""
  ) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "Todos los campos son obligatorios.",
      valores,
    });
  }

  if (!servicioReservas.obtenerSalasPermitidas().includes(sala)) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "La sala seleccionada no es válida.",
      valores,
    });
  }

  if (!["Mañana", "Tarde", "Noche"].includes(turno)) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "El turno seleccionado no es válido.",
      valores,
    });
  }

  if (!email.includes("@")) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "El email debe contener @.",
      valores,
    });
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "La cantidad de personas debe ser un entero entre 1 y 6.",
      valores,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
};

module.exports = {
  prepararAreaReservas,
  validarReserva,
};
