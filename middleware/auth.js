const jwt = require('jsonwebtoken');
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// nell'header è necessario mettere il token se voglio che sia accessibile solo da chi è loggato
exports.protect = asyncHandler(async(request, response, next)=>{
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
        //il token è quella parte senza Bearer spazio
        token = request.headers.authorization.split(' ')[1]

    } else if(request.cookies.token){
        //se non ho il token nell'header, controlla cosa ho nel cookie
        //per motivi di sicurezza al logout voglio cancellare anche il cookie
        token = request.cookies.token;
    }

    if(!token){
        return next(
            new ErrorResponse("Non sei autorizzato.", 401)
          );
    }

    try {
        // verificare il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        new ErrorResponse("Non sei autorizzato.", 401);
        next(error);
    }
})

//garantire l'accesso a un ruolo specifico
exports.authorize = (...roles)=>{
    return (request, response, next) => {
        if(roles.includes(request.user.role)===false){
            next(new ErrorResponse("Non sei autorizzato.", 401));            
        }
        next();
    }
}