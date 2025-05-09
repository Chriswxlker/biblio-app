// Importa los módulos necesarios
const createError = require('http-errors'); // Manejo de errores HTTP
const express = require('express'); // Framework para construir aplicaciones web
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios
const cookieParser = require('cookie-parser'); // Middleware para analizar cookies
const logger = require('morgan'); // Middleware para registrar solicitudes HTTP
const flash = require('express-flash'); // Middleware para mostrar mensajes flash
const session = require('express-session'); // Middleware para manejar sesiones
const mysql = require('mysql2'); // Cliente para conectarse a bases de datos MySQL
const connection = require('./lib/db'); // Archivo personalizado para manejar la conexión a la base de datos

// Importa los enrutadores para manejar diferentes rutas
const indexRouter = require('./routes/index'); // Rutas para la página principal
const usersRouter = require('./routes/users'); // Rutas para usuarios
const booksRouter = require('./routes/books'); // Rutas para libros

// Crea una instancia de la aplicación Express
const app = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views')); // Define la carpeta donde están las vistas
app.set('view engine', 'ejs'); // Configura EJS como el motor de plantillas

// Middlewares globales
app.use(logger('dev')); // Registra las solicitudes HTTP en la consola
app.use(express.json()); // Analiza las solicitudes con datos JSON
app.use(express.urlencoded({ extended: false })); // Analiza las solicitudes con datos codificados en URL
app.use(cookieParser()); // Habilita el análisis de cookies

// Configuración de sesiones
app.use(
  session({
    cookie: { maxAge: 60000 }, // Duración de la cookie de sesión (60 segundos)
    store: new session.MemoryStore(), // Almacena las sesiones en memoria
    saveUninitialized: true, // Guarda sesiones no inicializadas
    resave: true, // Fuerza el guardado de sesiones incluso si no hay cambios
    secret: 'secret' // Clave secreta para firmar la cookie de sesión
  })
);

// Middleware para mensajes flash
app.use(flash());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Define la carpeta "public" como estática

// Define las rutas principales de la aplicación
app.use('/', indexRouter); // Rutas para la página principal
app.use('/users', usersRouter); // Rutas para usuarios
app.use('/books', booksRouter); // Rutas para libros

// Middleware para manejar errores 404 (ruta no encontrada)
app.use((req, res, next) => {
  next(createError(404)); // Crea un error 404 y lo pasa al manejador de errores
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.locals.message = err.message; // Mensaje de error
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Muestra detalles del error solo en desarrollo

  res.status(err.status || 500); // Establece el código de estado HTTP
  res.render('error'); // Renderiza la vista de error
});

// Middleware adicional para servir archivos estáticos (parece redundante)
app.use(express.static('public'));

// Exporta la aplicación para que pueda ser utilizada en otros archivos
module.exports = app;