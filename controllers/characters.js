//middleware (tutte le funzioni middleware hanno i parametri request, response e next)
const Character = require("../models/Character");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Film = require("../models/Film");
const successHandler = require("../middleware/success");

/* 
@desc   API per ottenere tutti i personaggi in generale e tutti quelli associati a un film
@route  GET /api/v1/character
@route  GET /api/v1/film/:filmId/characters
@access Public (non serve autenticazione)
*/
exports.getCharacters = asyncHandler(async(request, response, next) => {
    let query;
    if(request.params.filmId){
        query = Character.find({film: request.params.filmId});
    }else{
        //populate mi permette di avere anche tutti i dati del film associato al personaggio non solo l'id
        //query= Character.find().populate('film'); mi da tutti i dati del film, se invece voglio solo alcuni di questi dati
        //come titolo e descrizione scriverò una cosa del genere
        query= Character.find().populate({
            path: "film",
            select: "title description"
        });
    }
    const count = await Character.countDocuments(query);
    const characters = await query;
    successHandler(response, true, count, null, characters);
});

/* 
@desc   API per ottenere uno specifico personaggio
@route  GET /api/v1/character/:id
@access Public (non serve autenticazione)
*/
exports.getCharacter = asyncHandler(async(request, response, next) => {
    const character = await Character.findById(request.params.id).populate({
        path: 'film',
        select: "title description"
      });;

    if(!character){
        return next(new ErrorResponse(`Nessun personaggio corrisponde all'id ${request.params.id}`), 404)
    }
    successHandler(response, true, null, null, character);
});

/* 
@desc   API per aggiornare un personaggio
@route  PUT /api/v1/character/:id
@access Private (serve autenticazione)
*/
exports.updateCharacter = asyncHandler(async(request, response, next) => {
    let character = await Character.findById(request.params.id);

    if(!character){
        return next(new ErrorResponse(`Nessun personaggio corrisponde all'id ${request.params.id}`), 404)
    }

    character = await Character.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
    });
    successHandler(response, true, null, null, character);
});

/* 
@desc   API per aggiungere un personaggio
@route  CREATE /api/v1/film/:filmId/characters
@access Private (serve autenticazione)
*/
exports.addCharacter = asyncHandler(async(request, response, next) => {

    request.body.film = request.params.filmId;

    const film = await Film.findById(request.params.filmId);
    if(!film){
        return next(new ErrorResponse(`Nessun film corrisponde all'id ${request.params.filmId}`), 404)
    }

    const character = await Character.create(request.body);
    successHandler(response, true, null, null, character);
});

/* 
@desc   API per eliminare un personaggio
@route  DELETE /api/v1/character/:id
@access Private (serve autenticazione)
*/
exports.deleteCharacter = asyncHandler(async(request, response, next) => {
    await Character.findByIdAndDelete(request.params.id);
    successHandler(response, true, null, null, {});
});