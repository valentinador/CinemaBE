const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');//sanitize data
const helmet = require('helmet'); // protezione xss
//dotenv è una libreria che permette il caricamento dei file .env
const dotenv = require('dotenv');
const xssClean = require('xss-clean');
/* express-rate-limit serve a limitare il numero di richieste che un client può fare in un determinato periodo di tempo. 
Questo è utile per prevenire attacchi brute-force, DoS (Denial of Service) o DDoS (Distributed Denial of Service) */
const rateLimit = require('express-rate-limit');
/* hpp protegge dagli attacchi HTTP Parameter Pollution (HPP) che sfruttano la possibilità di inviare più valori per 
lo stesso parametro in una query string o nel body della richiesta. hpp rimuove i parametri duplicati dalla query string 
o dal body, prendendo in considerazione solo il primo valore. */
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error');
//caricamento dei file env
dotenv.config({path: "config/config.env"})

//connessione al database
connectDB();

//caricamento delle rotte
const films = require("./routes/films");
const characters = require("./routes/characters");
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');


const app=express();
app.use(express.json());

//xss
app.use(helmet({
    contentSecurityPolicy: false, // Se non stai utilizzando CSP, potresti volerlo disabilitare.
    frameguard: { action: 'deny' }, // Protegge contro clickjacking
    hidePoweredBy: true,  // Nasconde il header X-Powered-By
    noSniff: true,  // Impedisce il browser di sniffare il tipo di contenuto
    xssFilter: false, // Solo per i browser "vecchi"
  }));

// Prevenire attacchi xss
app.use(xssClean());

// Rate Limit
const limiter = rateLimit({
    windowMs: 10*60*1000, //10 minuti
    max:100
});
app.use(limiter);

//hpp
app.use(hpp());

//abilita il cors
app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
  }));
  app.options('*', cors());  // Gestisce tutte le richieste preflight (per ora accetta tutto)


//cookie parser
app.use(cookieParser());

//logger con morgan
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//upload locandina del film
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());


// settare cartella statica per gli upload
app.use(express.static(path.join(__dirname, 'public')));

//montare il router in uno specifico url
app.use('/api/v1/film', films);
app.use('/api/v1/character', characters);
app.use('/api/v1/auth', auth);

//gestione errore che deve essere sotto il router
app.use(errorHandler);
const PORT=process.env.PORT;

const server = app.listen(PORT, console.log(`ambiente: ${process.env.NODE_ENV}`))

//gestione della promise che non vanno a buon fine "unhandled promise rejection"
process.on('unhandledRejection', (error, promise) => {
    console.log(`Si è verificato il seguente errore: ${error.message}`);
    server.close(()=>process.exit(1));
})
