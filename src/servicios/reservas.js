const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const reservas = [
  {
    id: 1,
    estudiante: "Ana Pérez",
    email: "anap@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-25",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Lucas Gómez",
    email: "lgomez@gmail.com",
    sala: "Sala Sur",
    fecha: "2026-09-26",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Sofía Lopez",
    email: "sofillopez@gmail.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-27",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Tomás Mendoza",
    email: "tomendoza@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-28",
    turno: "Mañana",
    personas: 1,
  },
];

function obtenerTodas() {
  return reservas;
}

function obtenerPorId(id) {
  return reservas.find((reserva) => reserva.id === Number(id));
}

function contar() {
  return reservas.length;
}

function crear(datos) {
  const nuevaReserva = {
    id: reservas.length + 1,
    ...datos,
  };

  reservas.push(nuevaReserva);

  return nuevaReserva;
}

function obtenerSalasPermitidas() {
  return salasPermitidas;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  contar,
  crear,
  obtenerSalasPermitidas,
};
