# Trabajo práctico 06 — Salas de estudio modular

## Descripción

Aplicación web desarrollada con Node.js, Express y EJS para consultar salas de estudio y registrar reservas temporales.

El proyecto organiza sus responsabilidades en módulos separados: configuración, aplicación, rutas, controladores, servicios y middleware.

Utiliza middleware global, middleware de router y middleware de validación para procesar las solicitudes antes de ejecutar los controladores.

Las reservas se mantienen en memoria durante la ejecución del servidor. No se utiliza una base de datos ni se guardan las nuevas reservas en archivos.

## Estructura del proyecto

- `src/index.js`: importa la configuración y la aplicación, e inicia el servidor.
- `src/configuracion.js`: obtiene y valida las variables de entorno `PORT` y `NODE_ENV`.
- `src/app.js`: configura Express, los middleware globales, las rutas y la respuesta 404.
- `src/rutas/reservas.js`: declara las rutas del módulo de reservas.
- `src/controladores/reservas.js`: gestiona las solicitudes, las respuestas HTTP y la renderización de vistas.
- `src/servicios/reservas.js`: administra las reservas en memoria y las operaciones para consultarlas, contarlas y crearlas.
- `src/middleware/solicitudes.js`: identifica las solicitudes y mide su duración.
- `src/middleware/reservas.js`: prepara el contexto del router y valida los datos de las reservas.

Las vistas EJS se encuentran en `views/` y los archivos estáticos, como CSS, en `public/`.

## Instalación

Desde la carpeta raíz del proyecto, ejecutar:

`npm install`

## Configuración

El archivo `.env.example` contiene un ejemplo de las variables de entorno utilizadas:

`PORT=3000
NODE_ENV=development`

- `PORT`: puerto en el que se inicia el servidor. Si no se define, se utiliza `3000`.
- `NODE_ENV`: entorno de ejecución. Si no se define, se utiliza `development`.

La configuración valida que el puerto sea un número entero entre 1 y 65535. Si el valor no es válido, la aplicación muestra un error descriptivo.

El archivo `.gitignore` excluye `.env` y `node_modules/`.

## Ejecución

Para iniciar el servidor:

`npm start`

Con la configuración predeterminada, la aplicación queda disponible en:

http://localhost:3000

## Comandos disponibles

- `npm start`: inicia la aplicación.
- `npm run format`: aplica el formato de Prettier a los archivos JavaScript de `src/`.
- `npm run format:check`: comprueba el formato sin modificar los archivos.
- `npm run lint`: ejecuta ESLint sobre `src/`.
- `npm run check`: ejecuta la comprobación de formato y después ESLint.

## Rutas

| Método | Ruta | Descripción |
| GET | `/` | Muestra la página principal. |
| GET | `/estado` | Devuelve el estado del servicio en formato JSON, con la cantidad de reservas y el identificador de solicitud. |
| GET | `/reservas` | Muestra el listado de reservas. |
| GET | `/reservas/nueva` | Muestra el formulario para crear una reserva. |
| GET | `/reservas/:id` | Muestra el detalle de una reserva existente. |
| POST | `/reservas` | Valida y registra una nueva reserva en memoria. |

Si se solicita una reserva inexistente, se responde con estado HTTP 404. Las rutas que no existen también reciben una respuesta 404.

## Pipeline de middleware

El orden de ejecución configurado en `src/app.js` es:

1. `morgan`: registra las solicitudes HTTP en la terminal.
2. `identificarSolicitud`: genera un identificador consecutivo y lo guarda en `res.locals.solicitudId`.
3. `medirDuracion`: registra el inicio de la solicitud y calcula su duración cuando finaliza la respuesta mediante el evento `finish`.
4. `express-ejs-layouts`: configura el uso de layouts para las vistas.
5. `express.static`: permite servir los archivos estáticos.
6. `express.urlencoded()`: procesa los datos enviados mediante formularios.
7. `express.json()`: procesa los cuerpos de solicitudes JSON.
8. Rutas de la aplicación, incluida la página principal y `/estado`.
9. Router de reservas, montado en `/reservas`.
10. Middleware final 404, que responde cuando ninguna ruta coincide.

Los parsers `express.urlencoded()` y `express.json()` permiten acceder a los datos recibidos en `req.body`.

## Alcance de los middleware

### Middleware global

`morgan`, `identificarSolicitud`, `medirDuracion`, `express-ejs-layouts`, `express.static`, `express.urlencoded()` y `express.json()` se configuran en la aplicación y se ejecutan según el orden establecido.

### Middleware de router

`prepararAreaReservas` se aplica al router de reservas y establece:

`res.locals.seccion = "Reservas de salas"`

Luego las vistas del módulo de reservas disponen de la información de su sección. La ruta `/estado` se encuentra fuera de este router.

### Middleware de ruta

`validarReserva` se aplica al POST de creación:

`reservasRouter.post("/", validarReserva, crearReserva);`

Comprueba los datos antes de permitir que el controlador cree la reserva.

## Validación de reservas

El middleware `validarReserva`:

- Normaliza los textos mediante `trim()`.
- Convierte la cantidad de personas mediante `Number()`.
- Comprueba que los campos obligatorios estén completos.
- Comprueba que la sala pertenezca a las salas permitidas.
- Comprueba que el turno sea Mañana, Tarde o Noche.
- Comprueba que el correo electrónico contenga `@`.
- Comprueba que la cantidad de personas sea un número entero entre 1 y 6.

Si los datos son inválidos, responde con estado HTTP 400, muestra un mensaje accesible mediante `role="alert"` y conserva los valores ingresados en el formulario.

Si los datos son válidos, prepara `req.reservaValidada` y ejecuta `next()` para continuar hacia `crearReserva`.

La validación del navegador no reemplaza la validación del servidor, ya que los datos recibidos deben comprobarse también del lado del servidor.

## Creación de reservas y respuestas HTTP

Cuando los datos son válidos, el controlador utiliza el servicio para agregar la reserva al arreglo en memoria.

Después, responde con una redirección HTTP 302 hacia `/reservas`. El navegador realiza un nuevo GET y muestra el listado actualizado.

Esta secuencia permite mostrar la reserva creada sin volver a enviar el formulario al actualizar la página.

## Persistencia temporal

Las reservas iniciales y las operaciones para administrarlas se encuentran en `src/servicios/reservas.js`.

Las nuevas reservas se agregan al arreglo en memoria mediante `push()`. No se utiliza una base de datos ni se escriben las reservas en archivos.

Al reiniciar el servidor, se vuelve a cargar el conjunto de reservas iniciales y se pierden las nuevas reservas registradas durante la ejecución anterior.

## Pruebas manuales realizadas

- Inicio de la aplicación y acceso a la página principal.
- Consulta del estado del servicio en formato JSON.
- Consulta del listado de cuatro reservas iniciales.
- Acceso al formulario de nueva reserva.
- Consulta del detalle de una reserva existente.
- Consulta de una reserva inexistente con respuesta HTTP 404.
- Acceso a una ruta inexistente con respuesta HTTP 404.
- Envío de campos obligatorios vacíos con respuesta HTTP 400.
- Validación de una sala no permitida.
- Validación de un turno no permitido.
- Validación de un correo electrónico inválido.
- Validación de cantidades de personas fuera del rango permitido.
- Creación de una reserva válida, redirección HTTP 302 y consulta posterior del listado actualizado.
- Comprobación de los registros de Morgan y de la medición personalizada de duración.
- Inicio con el puerto predeterminado y con un puerto alternativo.
- Comprobación del mensaje de error ante un puerto inválido.
- Ejecución de `npm run check` sin errores.

## Conceptos aplicados

### Middleware incorporado, de terceros y personalizado

- **Incorporado:** funciones proporcionadas por Express, como `express.json()` y `express.urlencoded()`.
- **De terceros:** middleware instalado como dependencia, como Morgan y `express-ejs-layouts`.
- **Personalizado:** funciones creadas para la aplicación, como `identificarSolicitud`, `medirDuracion`, `prepararAreaReservas` y `validarReserva`.

### Uso de `next()`

`next()` permite continuar hacia el siguiente middleware o controlador de la cadena de ejecución. En la validación, se utiliza cuando los datos son válidos; si hay errores, el middleware responde sin continuar hacia la creación de la reserva.

### Evento `finish`

El evento `finish` de la respuesta HTTP se utiliza para calcular la duración de la solicitud una vez que la respuesta terminó de enviarse.

### Montaje del router

Al montar el router mediante `/reservas`, las rutas declaradas dentro de él quedan disponibles bajo ese prefijo. Por ejemplo, la ruta relativa `/nueva` queda disponible como `/reservas/nueva`.
