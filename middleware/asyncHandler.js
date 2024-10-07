/* 
    nel controller, ogni funzione necessita di un try/catch. 
    Per la leggibilità del codice è buona norma utilizzare un asyncHandler
    che mi permette di wrappare la funzione e avere un try/catch senza ripetere il codice
*/
const asyncHandler = fn => (request, response, next) => Promise.resolve(fn(request, response, next)).catch(next);
module.exports = asyncHandler;