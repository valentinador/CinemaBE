const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const successHandler = require("../middleware/success");

// @desc     Registra un nuovo utente
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (request, response, next) => {
  const { name, surname, email, password, role } = request.body;
  const user = await User.create({ name, surname, email, password, role });
  sendTokenResponse(user, 200, response);
});

// @desc     Login
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;
//gestione se manca l'email e/o la password
  if (!email || !password) {
    return next(
      new ErrorResponse("Per favore inserisci una mail e una password.", 400)
    );
  }

  //controlla se l'utente esiste
  const user = await User.findOne({email}).select('+password');
  if(!user){
    return next(
        new ErrorResponse("Utente non esistente.", 401)
    )
  }

  //controlla se la password inserita dall'utente corrisponde a quella sul db
  const isMatch = await user.matchPassword(password);
  if(!isMatch){
    return next(
        new ErrorResponse("Password errata.", 401)
    )
  }

  sendTokenResponse(user, 200, response);
});


// @desc     La funzione effettua il logout cancellando il cookie (che dentro ha il token)
// @route    GET /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (request, response, next) => {
  //Il secondo parametro 'none' è il valore del cookie.
  //impostare il valore su 'none' serve a svuotare il valore del cookie.
  //expires: Questa opzione imposta la scadenza del cookie. new Date(Date.now() + 10 * 1000) 
  //crea un'istanza di Date che rappresenta l'ora corrente più 10 secondi. Quindi, il cookie 
  //scadrà 10 secondi dopo che viene inviato. Dopo la scadenza, il cookie verrà 
  //automaticamente eliminato dal browser.
  //httpOnly: true rende il cookie accessibile solo tramite HTTP, non può essere letto 
  //o manipolato dal JavaScript lato client. Questo migliora la sicurezza perché 
  //impedisce che il cookie possa essere letto tramite JavaScript, 
  //riducendo il rischio di attacchi come il Cross-Site Scripting (XSS).
  response.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly:true
  })
  successHandler(response, true, null, null, {});
});

//La funzione prende il token dal model, crea il cookie con il token e manda le risposte
const sendTokenResponse = (user, statusCode, result)=>{
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), //30 giorni
        httpOnly: true //il cookie deve avere accesso solo client side
    }
    result.status(statusCode).cookie('token', token, options).json({success:true, token})

}

// @desc     Prendi i dati dell'utente loggato
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.user.id);
  successHandler(response, true, null, null, user);
});