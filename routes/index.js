// Importa el módulo Express
const express = require('express');

// Crea un enrutador para manejar las rutas de esta sección
const router = express.Router();

/* 
  Define una ruta GET para la página principal ('/').
  Cuando un usuario accede a la raíz del sitio web, esta función se ejecuta.
*/
router.get('/', (req, res) => {
  // Renderiza la vista 'index' y pasa un objeto con el título de la página
  res.render('index', {
    title: 'Biblio - App' // Título que se mostrará en la página
  });
});

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;