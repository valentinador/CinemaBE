const logger = (request, response, next)=>{
    request.info = `${request.method} - ${request.protocol}://${request.get('host')}${request.originalUrl}`;
    next();
}

module.exports = logger;