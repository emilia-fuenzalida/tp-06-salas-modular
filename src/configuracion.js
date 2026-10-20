const puertoTexto = process.env.PORT || "3000";
const PORT = Number(puertoTexto);
const NODE_ENV = process.env.NODE_ENV || "development";

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(
    `PORT inválido: "${puertoTexto}". Debe ser un número entero entre 1 y 65535.`,
  );
}

module.exports = {
  PORT,
  NODE_ENV,
};
