const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth')

const {getFilm, getFilms, createFilm, updateFilm, deleteFilm, filmPosterUpload} = require('../controllers/films');

//includere altre risorse a questo router (ad esempio characters)
const charactersRouter = require('./characters');
router.use('/:filmId/characters', charactersRouter);

router.route('/:id/locandina').put(protect, filmPosterUpload);

//le rotte senza id
router.route('/').get(getFilms).post(protect, createFilm);

//le rotte con gli id
router.route('/:id').get(getFilm).put(protect, updateFilm).delete(protect, deleteFilm);


module.exports = router;