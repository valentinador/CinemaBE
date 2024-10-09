//middleware (tutte le funzioni middleware hanno i parametri request, response e next)
const path = require('path');
const Film = require("../models/Film");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Character = require("../models/Character");
const successHandler = require('../middleware/success');
/* 
@desc   API per ottenere tutti i film
@route  GET /api/v1/film
@access Public (non serve autenticazione)
*/
exports.getFilms = asyncHandler(async (request, response, next) => {
  const reqQuery = { ...request.query };
  //campi da escludere
  const removeFields = ["sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  //creazione della query string
  let queryString = JSON.stringify(reqQuery);
  //creazione degli operatori $gt, $gte, etc... per costruire un filtro sulla valutazione del film (le stelle)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //la get di film con populate contiene un array dei personaggi (vedi models/Film.js)
  let query = Film.find(JSON.parse(queryString)).populate("characters");
  //ordinamento in ordine alfabetico o per le stelle
  if (reqQuery.sort) {
    const sortBy = request.query.sort; //.split(',').join(' ') se ho più parametri
    query = query.sort({ [sortBy]: 1 });
  } else {
    query = query.sort({ averageRating: 1 }); //1 è ordine crescente, -1 è ordine decrescente
  }
  //Paginazione
  const page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Film.countDocuments();
  query = query.skip(startIndex).limit(limit);
  const films = await query;
  const count = await Film.countDocuments(query);

  //risultati della paginazione (lo scopo è ottenere qual è la pagina successiva e la precedente)
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  successHandler(response, true, null, pagination, films);
});

/* 
@desc   API per ottenere un film specifico
@route  GET /api/v1/film/:id
@access Public (non serve autenticazione)
*/
exports.getFilm = asyncHandler(async (request, response, next) => {
  const film = await Film.findById(request.params.id)
  successHandler(response, true, null, null, film);

});

/* 
@desc   API per aggiungere un film
@route  POST /api/v1/film
@access Private (serve autenticazione)
*/
exports.createFilm = asyncHandler(async (request, response, next) => {
  const film = await Film.create(request.body);
  successHandler(response, true, null, null, film);
});

/* 
@desc   API per aggiornare un film
@route  PUT /api/v1/film/:id
@access Private (serve autenticazione)
*/
exports.updateFilm = asyncHandler(async (request, response, next) => {
  const film = await Film.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  successHandler(response, true, null, null, film);
});

/* 
@desc   API per eliminare un film
@route  DELETE /api/v1/film/:id
@access Private (serve autenticazione)
*/
exports.deleteFilm = asyncHandler(async (request, response, next) => {
  //Cancellazione del film con i personaggi a cascata
  await Film.findByIdAndDelete(request.params.id);
  await Character.deleteMany({ film: request.params.id });
  successHandler(response, true, null, null, {});
});

/* 
@desc   Caricare la locandina di un film
@route  PUT /api/v1/film/:id/locandina
@access Private (serve autenticazione)
*/
exports.filmPosterUpload = asyncHandler(async (request, response, next) => {
  //Cancellazione del film con i personaggi a cascata
  const film = await Film.findById(request.params.id);

  if(!film){
    return next(new ErrorResponse(`Nessun film corrisponde all'id ${request.params.id}`), 404)
  }

  if(!request.files){
    return next(new ErrorResponse('Ops, hai dimenticato di caricare il file', 400));
  }

  const file = request.files.file;
  //Controllo se il file è effettivamente un'immagine
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse('Formato immagine non valido. Accetta solo immagini.', 400));
  }

  //controlla la grandezza del file
  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse('Dimensione del file troppo grande.', 400));
  }

  //imposta un nome per il file caricato
  file.name = `photo_${film._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
    if(err){
      return next(new ErrorResponse('Upload fallito', 500));
    }
    await Film.findByIdAndUpdate(request.params.id, { photo: file.name });

    //su browser: localhost:3000/uploads/photo_[filmId].jpg
  })
  successHandler(response, true, null, null, film.name);
});
