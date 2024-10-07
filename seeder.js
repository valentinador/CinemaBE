/*  Questo script permette di cancellare tutti i film presenti sul db oppure caricare i 
    film presenti in data/films.json  
*/

const fs = require('fs');
const mongoose = require("mongoose");
const dotenv = require('dotenv');

//caricamento variabili d'ambiente
dotenv.config({path: "./config/config.env"});

//caricamento dello schema
const Film = require('./models/Film');
const Character = require('./models/Character');


//connessione al db
mongoose.connect(process.env.MONGO_URI);

//per prima cosa bisogna leggere il file json con i dati
const films = JSON.parse(fs.readFileSync(`${__dirname}/data/films.json`, 'utf-8'));
const characters = JSON.parse(fs.readFileSync(`${__dirname}/data/characters.json`, 'utf-8'));

//ora è possibile caricare i dati sul db
const importData = async()=>{
    try {
        await Film.create(films);
        await Character.create(characters);
        console.log("I dati sono stati importati correttamente!");
        process.exit();
    } catch (error) {
        console.log('I dati non sono stati importati :( \n Si è verificato il seguente errore: ', error);
    }
}

//per svuotare i dati dal db
const deleteData = async()=>{
    try {
        await Film.deleteMany();
        await Character.deleteMany();
        console.log("I dati sono stati eliminati correttamente!");
        process.exit();
    } catch (error) {
        console.log('I dati non sono stati eliminati :( \n Si è verificato il seguente errore: ', error);
    }
}

//le funzioni importData e deleteData le chiamerò da terminale, quindi:
//  node seeder -i --> chiamerà importData
//  node seeder -d --> chiamerà deleteData
if(process.argv[2] === "-i"){
    importData();
} else if(process.argv[2] === "-d"){
    console.log('process.argv[2] ', process.argv[2]);

    deleteData();
}
