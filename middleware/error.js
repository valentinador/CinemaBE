const { cloneDeep } = require("lodash");
const ErrorResponse = require("../utils/errorResponse");

//per gestire gli errori derivanti dalle chiamate
const errorHandler = (error, request, response, next) => {
  let err = cloneDeep(error);
  err.message = error.message;
  /* 
    Supponiamo di cercare i dati MongoDB tramite _id, e che l'ID passato non sia valido. In questo 
    caso, Mongoose lancerà un CastError perché si aspetta un ObjectId, ma riceve un formato di dato 
    errato (ad esempio una stringa che non corrisponde al formato corretto di un ObjectId). Per questo
    si gestisce con un CastError
    */
  if (error.name === "CastError") {
    const message = `Il dato non esiste`;
    err = new ErrorResponse(message, 404);
  }

  /*   gestione errore per valore duplicato: in questo caso l'errore non ha un nome
        quindi non può essere gestito come sopra ma dobbiamo fare un controllo sul "code"
        e il codice relativo a questo tipo di errore è 11000. Sappiamo che il name deve essere univoco
        (models/Film.js), inserendo un film con lo stesso name dovrei ottenere questo errore
    */
  if (error.code === 11000 || error.code === "E11000") {
    const message = `Il film è già presente nel db`;
    err = new ErrorResponse(message, 409); 
  }

  //gestione errori di validazione
  if(error.name==="ValidationError"){
    const message = Object.values(error.errors).map(val=>val.message);
    err = new ErrorResponse(message, 400); 
  }


  //error.statusCode dipende dalla classe ErrorResponse in utils/errorResponse
  response.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
