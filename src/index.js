const { PORT } = require("./configuracion");
const app = require("./app");

app.listen(PORT, () => {
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
});
