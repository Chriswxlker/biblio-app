const express = require('express');
const router = express.Router();
const dbConn = require('../lib/db');

// Mostrar lista de libros
router.get('/', (req, res) => {
  dbConn.query('SELECT * FROM books ORDER BY id DESC', (err, rows) => {
    if (err) {
      req.flash('error', err);
      res.render('books', { data: '' });
    } else {
      res.render('books', { data: rows });
    }
  });
});

// Formulario para añadir libro
router.get('/add', (req, res) => {
  res.render('books/add', {
    name: '',
    author: ''
  });
});

// Añadir libro
router.post('/add', (req, res) => {
  const { name, author } = req.body;
  let errors = false;

  if (!name || !author) {
    errors = true;
    req.flash('error', 'Por favor escribe el nombre y el autor del libro');
    return res.render('books/add', { name, author });
  }

  if (!errors) {
    const form_data = { name, author };
    dbConn.query('INSERT INTO books SET ?', form_data, (err) => {
      if (err) {
        req.flash('error', err);
        return res.render('books/add', form_data);
      } else {
        req.flash('success', 'Libro añadido correctamente');
        res.redirect('/books');
      }
    });
  }
});

// Mostrar formulario de edición
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;

  dbConn.query('SELECT * FROM books WHERE id = ?', [id], (err, rows) => {
    if (err) throw err;

    if (rows.length <= 0) {
      req.flash('error', `Book not found with id = ${id}`);
      return res.redirect('/books');
    }

    res.render('books/edit', {
      title: 'Edit Book',
      id: rows[0].id,
      name: rows[0].name,
      author: rows[0].author
    });
  });
});

// Actualizar libro
router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, author } = req.body;
  let errors = false;

  if (!name || !author) {
    errors = true;
    req.flash('error', 'Por favor escribe el nombre y el autor del libro');
    return res.render('books/edit', { id, name, author });
  }

  if (!errors) {
    const form_data = { name, author };
    dbConn.query('UPDATE books SET ? WHERE id = ?', [form_data, id], (err) => {
      if (err) {
        req.flash('error', err);
        return res.render('books/edit', { id, name, author });
      } else {
        req.flash('success', 'Libro actualizado con éxito!');
        res.redirect('/books');
      }
    });
  }
});

// Eliminar libro
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  dbConn.query('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', `Libro eliminado con éxito! ID = ${id}`);
    }
    res.redirect('/books');
  });
});

module.exports = router;
