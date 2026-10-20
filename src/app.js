const path = require("node:path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const { NODE_ENV } = require("./configuracion");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const reservasRouter = require("./rutas/reservas");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.set("layout", "layouts/main");

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.use(identificarSolicitud);
app.use(medirDuracion);

app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("inicio", {
    title: "Inicio",
  });
});

app.get("/estado", (req, res) => {
  const servicioReservas = require("./servicios/reservas");

  res.json({
    servicio: "activo",
    reservas: servicioReservas.contar(),
    solicitudId: res.locals.solicitudId,
  });
});

app.use("/reservas", reservasRouter);

app.use((req, res) => {
  res.status(404).render("no-encontrado", {
    titulo: "Página no encontrada",
    mensaje: "La dirección solicitada no existe.",
  });
});

module.exports = app;
