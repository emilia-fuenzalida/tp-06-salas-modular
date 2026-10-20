let contadorSolicitud = 0;

const identificarSolicitud = (req, res, next) => {
  contadorSolicitud++;

  const solicitudId = `BIB-${String(contadorSolicitud).padStart(4, "0")}`;

  res.locals.solicitudId = solicitudId;

  next();
};

const medirDuracion = (req, res, next) => {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracion = Date.now() - inicio;

    console.log(
      `${res.locals.solicitudId} ${req.method} ${req.originalUrl} ${res.statusCode} ${duracion} ms`,
    );
  });

  next();
};

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
